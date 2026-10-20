import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../../domain/entities/verificationDocument.entity";
import {
    IVerificationDocumentRepository,
    GetAdminKycRequestsInput,
    GetAdminKycResponse,
    UpdateDocumentStatusInput,
    AdminKycStats
} from "../../domain/repositories/IVerificationDocumentRepository";
import { VerificationDocumentMapper } from "../mappers/verificationDocument.mapper";
import { VerificationFileMapper } from "../mappers/verificationFile.mapper";
import { VerificationProfile } from "../../domain/entities/verificationProfile.entity";
import { VerificationProfileMapper } from "../mappers/verificationProfile.mapper";
import { CreateVerificationDocumentInputDto } from "../../application/dtos/request/create-verification-document.dto";
import { UpdateVerificationDocumentRepositoryDto } from "../../application/dtos/request/update-veridication-document-repository.dto";



export class VerificationDocumentRepository implements IVerificationDocumentRepository {
    async findById(id: string): Promise<VerificationDocument | null> {
        const record = await db.orm.public.provider_verification_documents
            .where({ id: id as never })
            .include("files")
            .first();

        if (!record) return null;
        return VerificationDocumentMapper.toDomain(record);
    }

    async findByProviderId(providerId: string): Promise<VerificationDocument[]> {
        const records = await db.orm.public.provider_verification_documents
            .where({ provider_id: providerId as never })
            .include("files")
            .orderBy((doc) => doc.created_at.desc())
            .all();

        return records.map((record) =>
            VerificationDocumentMapper.toDomain(record)
        );
    }

    async findByProviderAndType(providerId: string, documentType: VerificationDocumentType): Promise<VerificationDocument | null> {
        const record = await db.orm.public.provider_verification_documents
            .where({ provider_id: providerId as never, document_type: documentType as never })
            .include("files")
            .first();

        if (!record) return null;
        return VerificationDocumentMapper.toDomain(record);
    }

    async createOrUpdate(input: CreateVerificationDocumentInputDto): Promise<VerificationDocument> {
        return await db.transaction(async (tx) => {
            const existing = await tx.orm.public.provider_verification_documents
                .where({ provider_id: input.provider_id as never, document_type: input.document_type as never })
                .first();

            let documentId: string;

            if (existing) {
                documentId = (existing as { id: string }).id;
                await tx.orm.public.provider_verification_documents
                    .where({ id: documentId as never })
                    .update({
                        document_name: input.document_name,
                        status: 'PENDING',
                        rejection_reason: null,
                        updated_at: Temporal.Now.instant()
                    } as never);

                const existingFiles = await tx.orm.public.provider_verification_files
                    .where({ document_id: documentId as never })
                    .all();

                for (const f of existingFiles) {
                    await tx.orm.public.provider_verification_files
                        .where({ id: (f as { id: string }).id as never })
                        .delete();
                }
            } else {
                const created = await tx.orm.public.provider_verification_documents.create({
                    provider_id: input.provider_id as never,
                    document_type: input.document_type as never,
                    document_name: input.document_name as never,
                    status: 'PENDING',
                    rejection_reason: null
                } as never);

                documentId = (created as unknown as { id: string }).id;
            }

            for (const fileUrl of input.file_urls) {
                await tx.orm.public.provider_verification_files.create(
                    VerificationFileMapper.toPersistence(documentId, fileUrl) as never
                );
            }

            const profile = await tx.orm.public.provider_profiles
                .where({ id: input.provider_id as never })
                .first();

            if (profile) {
                await tx.orm.public.provider_profiles
                    .where({ id: input.provider_id as never })
                    .update({
                        kyc_status: 'PENDING',
                        updated_at: Temporal.Now.instant()
                    } as never);
            }

            const record = await tx.orm.public.provider_verification_documents
                .where({ id: documentId as never })
                .include("files")
                .first();

            return VerificationDocumentMapper.toDomain(record)
        });
    }

    async updateDocument(id: string, input: UpdateVerificationDocumentRepositoryDto): Promise<VerificationDocument | null> {
        return await db.transaction(async (tx) => {
            const updateData: Record<string, unknown> = {
                status: 'PENDING',
                rejection_reason: null,
                updated_at: Temporal.Now.instant()
            };
            if (input.document_name) {
                updateData.document_name = input.document_name;
            }

            await tx.orm.public.provider_verification_documents
                .where({ id: id as never })
                .update(updateData as never);

            if (input.kept_file_ids !== undefined) {
                const currentFiles = await tx.orm.public.provider_verification_files
                    .where({ document_id: id as never })
                    .all();

                for (const f of currentFiles) {
                    const fileId = (f as { id: string }).id;
                    if (!input.kept_file_ids.includes(fileId)) {
                        await tx.orm.public.provider_verification_files
                            .where({ id: fileId as never })
                            .delete();
                    }
                }
            }

            if (input.new_file_urls && input.new_file_urls.length > 0) {
                for (const fileUrl of input.new_file_urls) {
                    await tx.orm.public.provider_verification_files.create(
                        VerificationFileMapper.toPersistence(id, fileUrl) as never
                    );
                }
            }

            const docRecord = await tx.orm.public.provider_verification_documents
                .where({ id: id as never })
                .include("files")
                .first();

            if (docRecord) {
                const profile = await tx.orm.public.provider_profiles
                    .where({ id: docRecord.provider_id as never })
                    .first();

                if (profile) {
                    await tx.orm.public.provider_profiles
                        .where({ id: docRecord.provider_id as never })
                        .update({
                            kyc_status: 'PENDING',
                            updated_at: Temporal.Now.instant()
                        } as never);
                }

                return VerificationDocumentMapper.toDomain(docRecord);
            }

            return null;
        });
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
        return await db.transaction(async (tx) => {
            const doc = await tx.orm.public.provider_verification_documents
                .where({ id: id as never })
                .first();

            if (!doc) return false;

            const files = await tx.orm.public.provider_verification_files
                .where({ document_id: id as never })
                .all();

            for (const file of files) {
                await tx.orm.public.provider_verification_files
                    .where({ id: (file as { id: string }).id as never })
                    .delete();
            }

            await tx.orm.public.provider_verification_documents
                .where({ id: id as never })
                .delete();

            const remainingDocsRecords = await tx.orm.public.provider_verification_documents
                .where({ provider_id: doc.provider_id as never })
                .include("files")
                .all();

            const remainingDocs = remainingDocsRecords.map((r) =>
                VerificationDocumentMapper.toDomain(r)
            );

            if (remainingDocs.length === 0) {
                await tx.orm.public.provider_profiles
                    .where({ id: doc.provider_id as never })
                    .update({
                        kyc_status: 'NOT_SUBMITTED',
                        updated_at: Temporal.Now.instant()
                    } as never);
            } else {
                const hasIdentityApproved = remainingDocs.some((d) => d.document_type === "IDENTITY" && d.status === "APPROVED");
                const hasCertificateApproved = remainingDocs.some((d) => d.document_type === "CERTIFICATE" && d.status === "APPROVED");
                const bothApproved = hasIdentityApproved && hasCertificateApproved;
                const allRejected = remainingDocs.every((d) => d.status === "REJECTED");
                const newKycStatus = bothApproved ? "APPROVED" : allRejected ? "REJECTED" : "PENDING";
                await tx.orm.public.provider_profiles
                    .where({ id: doc.provider_id as never })
                    .update({
                        kyc_status: newKycStatus,
                        updated_at: Temporal.Now.instant()
                    } as never);
            }

            return true;
        });
    }

    async getAllProfilesWithVerifications(): Promise<VerificationProfile[]> {
        const records = await db.orm.public.provider_profiles
            .include("user")
            .include("services", (s) => s.include("service"))
            .include("verification_documents", (d) => d.include("files"))
            .all();

        return records.map((record) => VerificationProfileMapper.toDomain(record));
    }

    async getAdminKycRequests(input: GetAdminKycRequestsInput): Promise<GetAdminKycResponse> {
        const page = input.page || 1;
        const limit = input.limit || 10;
        const skip = (page - 1) * limit;

        const allProfiles = await this.getAllProfilesWithVerifications();
        const submittedProfiles = allProfiles.filter((p) => p.hasUploadedDocuments());

        const stats: AdminKycStats = {
            pending: submittedProfiles.filter((p) => p.hasPendingDocuments()).length,
            approved: submittedProfiles.filter((p) => p.areAllDocumentsApproved()).length,
            rejected: submittedProfiles.filter((p) => p.hasRejectedDocuments()).length,
            total: submittedProfiles.length,
        };

        let filtered = submittedProfiles;

        if (input.status && input.status !== "ALL") {
            if (input.status === "PENDING") {
                filtered = filtered.filter((p) => p.hasPendingDocuments());
            } else if (input.status === "APPROVED") {
                filtered = filtered.filter((p) => p.areAllDocumentsApproved());
            } else if (input.status === "REJECTED") {
                filtered = filtered.filter((p) => p.hasRejectedDocuments());
            }
        }

        if (input.search) {
            filtered = filtered.filter((p) => p.matchesSearch(input.search!));
        }

        if (input.sort === "asc") {
            filtered.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        } else {
            filtered.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        }

        const total = filtered.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const paginated = filtered.slice(skip, skip + limit);

        const dossiers = paginated.map((profile) => VerificationProfileMapper.toDossier(profile));

        return { dossiers, total, totalPages, stats };
    }

    async resolveProviderProfileId(providerId: string): Promise<string> {
        let profile = await db.orm.public.provider_profiles
            .where({ id: providerId as never })
            .first();

        if (!profile) {
            profile = await db.orm.public.provider_profiles
                .where({ user_id: providerId as never })
                .first();
        }

        if (!profile) {
            throw new Error("Provider profile not found");
        }

        return (profile as any).id as string;
    }

    async updateDocumentStatus(input: UpdateDocumentStatusInput): Promise<void> {
        await db.orm.public.provider_verification_documents
            .where({ id: input.documentId as never })
            .update({
                status: input.status as never,
                rejection_reason: (input.status === "REJECTED" ? input.rejectionReason || "Verification rejected" : null) as never,
                updated_at: Temporal.Now.instant(),
            } as never);
    }

    async updateProviderKycStatus(profileId: string, kycStatus: string): Promise<void> {
        await db.orm.public.provider_profiles
            .where({ id: profileId as never })
            .update({
                kyc_status: kycStatus as never,
                updated_at: Temporal.Now.instant(),
            } as never);
    }
}
