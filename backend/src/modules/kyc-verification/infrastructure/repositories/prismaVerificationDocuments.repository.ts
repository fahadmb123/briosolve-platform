import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../../domain/entities/verificationDocument.entity.js";
import {
    IVerificationDocumentRepository,
    GetAdminKycRequestsInput,
    GetAdminKycResponse,
    UpdateKycStatusInput,
    AdminKycDossier,
    AdminKycStats
} from "../../domain/repositories/IVerificationDocumentRepository.js";
import { VerificationDocumentMapper } from "../mappers/verificationDocument.mapper.js";
import { CreateVerificationDocumentInputDto, UpdateVerificationDocumentRepositoryDto, VerificationDocumentRaw } from "../../application/Dto/verificationDto.js";

export class VerificationDocumentRepository implements IVerificationDocumentRepository {
    async findById(id: string): Promise<VerificationDocument | null> {
        const record = await db.orm.public.provider_verification_documents
            .where({ id: id as never })
            .include("files")
            .first();

        if (!record) return null;
        return VerificationDocumentMapper.toDomain(record as VerificationDocumentRaw);
    }

    async findByProviderId(providerId: string): Promise<VerificationDocument[]> {
        const records = await db.orm.public.provider_verification_documents
            .where({ provider_id: providerId as never })
            .include("files")
            .orderBy((doc) => doc.created_at.desc())
            .all();

        return records.map((record) =>
            VerificationDocumentMapper.toDomain(record as VerificationDocumentRaw)
        );
    }

    async findByProviderAndType(providerId: string, documentType: VerificationDocumentType): Promise<VerificationDocument | null> {
        const record = await db.orm.public.provider_verification_documents
            .where({ provider_id: providerId as never, document_type: documentType as never })
            .include("files")
            .first();

        if (!record) return null;
        return VerificationDocumentMapper.toDomain(record as VerificationDocumentRaw);
    }

    async createOrUpdate(input: CreateVerificationDocumentInputDto): Promise<VerificationDocument> {
        const existing = await this.findByProviderAndType(input.provider_id, input.document_type);
        let documentId: string;

        if (existing) {
            documentId = existing.id;
            await db.orm.public.provider_verification_documents
                .where({ id: documentId as never })
                .update({
                    document_name: input.document_name,
                    status: 'PENDING',
                    rejection_reason: null,
                    updated_at: Temporal.Now.instant()
                } as never);

            const existingFiles = await db.orm.public.provider_verification_files
                .where({ document_id: documentId as never })
                .all();

            for (const f of existingFiles) {
                await db.orm.public.provider_verification_files
                    .where({ id: (f as { id: string }).id as never })
                    .delete();
            }
        } else {
            const created = await db.orm.public.provider_verification_documents.create({
                provider_id: input.provider_id as never,
                document_type: input.document_type as never,
                document_name: input.document_name as never,
                status: 'PENDING',
                rejection_reason: null
            } as never);

            documentId = (created as unknown as { id: string }).id;
        }

        for (const fileUrl of input.file_urls) {
            await db.orm.public.provider_verification_files.create({
                document_id: documentId as never,
                file_url: fileUrl as never
            } as never);
        }

        const profile = await db.orm.public.provider_profiles
            .where({ id: input.provider_id as never })
            .first();

        if (profile && profile.kyc_status !== 'APPROVED') {
            await db.orm.public.provider_profiles
                .where({ id: input.provider_id as never })
                .update({
                    kyc_status: 'PENDING',
                    updated_at: Temporal.Now.instant()
                } as never);
        }

        const result = await this.findById(documentId);
        return result!;
    }

    async updateDocument(id: string, input: UpdateVerificationDocumentRepositoryDto): Promise<VerificationDocument | null> {
        const updateData: Record<string, unknown> = {
            status: 'PENDING',
            rejection_reason: null,
            updated_at: Temporal.Now.instant()
        };
        if (input.document_name) {
            updateData.document_name = input.document_name;
        }

        await db.orm.public.provider_verification_documents
            .where({ id: id as never })
            .update(updateData as never);

        if (input.kept_file_ids !== undefined) {
            const currentFiles = await db.orm.public.provider_verification_files
                .where({ document_id: id as never })
                .all();

            for (const f of currentFiles) {
                const fileId = (f as { id: string }).id;
                if (!input.kept_file_ids.includes(fileId)) {
                    await db.orm.public.provider_verification_files
                        .where({ id: fileId as never })
                        .delete();
                }
            }
        }

        if (input.new_file_urls && input.new_file_urls.length > 0) {
            for (const fileUrl of input.new_file_urls) {
                await db.orm.public.provider_verification_files.create({
                    document_id: id as never,
                    file_url: fileUrl as never
                } as never);
            }
        }

        const doc = await this.findById(id);
        if (doc) {
            const profile = await db.orm.public.provider_profiles
                .where({ id: doc.provider_id as never })
                .first();

            if (profile && profile.kyc_status !== 'APPROVED') {
                await db.orm.public.provider_profiles
                    .where({ id: doc.provider_id as never })
                    .update({
                        kyc_status: 'PENDING',
                        updated_at: Temporal.Now.instant()
                    } as never);
            }
        }

        return doc;
    }

    async updateStatus(id: string, status: VerificationDocumentStatus, rejectionReason?: string | null): Promise<VerificationDocument | null> {
        await db.orm.public.provider_verification_documents
            .where({ id: id as never })
            .update({
                status: status as never,
                rejection_reason: (rejectionReason ?? null) as never,
                updated_at: Temporal.Now.instant()
            } as never);

        return this.findById(id);
    }

    async deleteDocument(id: string): Promise<boolean> {
        const doc = await this.findById(id);
        if (!doc) return false;

        const files = await db.orm.public.provider_verification_files
            .where({ document_id: id as never })
            .all();

        for (const file of files) {
            await db.orm.public.provider_verification_files
                .where({ id: (file as { id: string }).id as never })
                .delete();
        }

        await db.orm.public.provider_verification_documents
            .where({ id: id as never })
            .delete();

        const remainingDocs = await this.findByProviderId(doc.provider_id);
        if (remainingDocs.length === 0) {
            await db.orm.public.provider_profiles
                .where({ id: doc.provider_id as never })
                .update({
                    kyc_status: 'NOT_SUBMITTED',
                    updated_at: Temporal.Now.instant()
                } as never);
        }

        return true;
    }

    async getAdminKycRequests(input: GetAdminKycRequestsInput): Promise<GetAdminKycResponse> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const skip = (page - 1) * limit;

        const allProfiles = await db.orm.public.provider_profiles
            .include("user")
            .include("services", (s) => s.include("service"))
            .include("verification_documents", (d) => d.include("files"))
            .all();

        const submittedProfiles = allProfiles.filter(
            (p) => p.kyc_status !== "NOT_SUBMITTED" || (p.verification_documents && p.verification_documents.length > 0)
        );

        const stats: AdminKycStats = {
            pending: submittedProfiles.filter((p) => p.kyc_status === "PENDING").length,
            approved: submittedProfiles.filter((p) => p.kyc_status === "APPROVED").length,
            rejected: submittedProfiles.filter((p) => p.kyc_status === "REJECTED").length,
            total: submittedProfiles.length,
        };

        let filtered = submittedProfiles;

        if (input.status && input.status !== "ALL") {
            filtered = filtered.filter((p) => p.kyc_status === input.status);
        }

        if (input.search) {
            const q = input.search.trim().toLowerCase();
            filtered = filtered.filter((p: any) =>
                p.user?.email?.toLowerCase().includes(q)
            );
        }

        if (input.sort === "asc") {
            filtered.sort((a, b) => new Date(a.created_at.toString()).getTime() - new Date(b.created_at.toString()).getTime());
        } else {
            filtered.sort((a, b) => new Date(b.created_at.toString()).getTime() - new Date(a.created_at.toString()).getTime());
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const paginated = filtered.slice(skip, skip + limit);

        const dossiers: AdminKycDossier[] = paginated.map((p: any) => ({
            id: p.id,
            user_id: p.user_id,
            business_name: p.business_name,
            experience: p.experience,
            bio: p.bio,
            profile_image: p.profile_image,
            kyc_status: p.kyc_status,
            created_at: p.created_at,
            updated_at: p.updated_at,
            user: {
                id: p.user?.id,
                name: p.user?.name,
                email: p.user?.email,
                phone: p.user?.phone ?? null,
            },
            services: (p.services || []).map((s: any) => ({
                id: s.service?.id || s.id,
                name: s.service?.name || "Service",
            })),
            documents: (p.verification_documents || []).map((d: any) => ({
                id: d.id,
                document_type: d.document_type,
                document_name: d.document_name,
                status: d.status,
                rejection_reason: d.rejection_reason ?? null,
                created_at: d.created_at,
                files: (d.files || []).map((f: any) => ({
                    id: f.id,
                    file_url: f.file_url,
                })),
            })),
        }));

        return { dossiers, total, totalPages, stats };
    }

    async updateKycStatus(input: UpdateKycStatusInput): Promise<void> {
        let profile = await db.orm.public.provider_profiles
            .where({ id: input.providerId as never })
            .first();

        if (!profile) {
            profile = await db.orm.public.provider_profiles
                .where({ user_id: input.providerId as never })
                .first();
        }

        if (!profile) {
            throw new Error("Provider profile not found");
        }

        if (input.documentId) {
            await db.orm.public.provider_verification_documents
                .where({ id: input.documentId as never })
                .update({
                    status: input.status as never,
                    rejection_reason: (input.status === "REJECTED" ? input.rejectionReason || "Verification rejected" : null) as never,
                    updated_at: Temporal.Now.instant(),
                } as never);

            const allDocs = await db.orm.public.provider_verification_documents
                .where({ provider_id: profile.id as never })
                .all();

            const hasRejected = allDocs.some((d) => d.status === "REJECTED");
            const allApproved = allDocs.length > 0 && allDocs.every((d) => d.status === "APPROVED");

            const newKycStatus = hasRejected ? "REJECTED" : allApproved ? "APPROVED" : "PENDING";

            await db.orm.public.provider_profiles
                .where({ id: profile.id as never })
                .update({
                    kyc_status: newKycStatus as never,
                    updated_at: Temporal.Now.instant(),
                } as never);
        } else {
            await db.orm.public.provider_profiles
                .where({ id: profile.id as never })
                .update({
                    kyc_status: input.status as never,
                    updated_at: Temporal.Now.instant(),
                } as never);

            const docs = await db.orm.public.provider_verification_documents
                .where({ provider_id: profile.id as never })
                .all();

            for (const doc of docs) {
                await db.orm.public.provider_verification_documents
                    .where({ id: (doc as any).id as never })
                    .update({
                        status: input.status as never,
                        rejection_reason: (input.status === "REJECTED" ? input.rejectionReason || "Verification rejected" : null) as never,
                        updated_at: Temporal.Now.instant(),
                    } as never);
            }
        }
    }
}
