import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../../domain/entities/verificationDocument.entity.js";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository.js";
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
}
