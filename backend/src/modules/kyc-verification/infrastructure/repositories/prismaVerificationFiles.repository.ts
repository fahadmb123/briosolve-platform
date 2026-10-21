import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { VerificationFile } from "../../domain/entities/verificationFile.entity";
import { IVerificationFileRepository } from "../../domain/repositories/IVerificationFileRepository";
import { VerificationFileMapper } from "../mappers/verificationFile.mapper";


export class VerificationFileRepository implements IVerificationFileRepository {
    async create(documentId: string, fileUrl: string): Promise<VerificationFile> {
        const record = await db.orm.public.provider_verification_files.create(
            VerificationFileMapper.toPersistence(documentId, fileUrl) as never
        );

        return VerificationFileMapper.toDomain(record);
    }

    async createMany(documentId: string, fileUrls: string[]): Promise<VerificationFile[]> {
        return await db.transaction(async (tx) => {
            const results: VerificationFile[] = [];
            for (const fileUrl of fileUrls) {
                const record = await tx.orm.public.provider_verification_files.create(
                    VerificationFileMapper.toPersistence(documentId, fileUrl) as never
                );
                results.push(VerificationFileMapper.toDomain(record));
            }
            return results;
        });
    }

    async findByDocumentId(documentId: string): Promise<VerificationFile[]> {
        const records = await db.orm.public.provider_verification_files
            .where({ document_id: documentId as never })
            .all();

        return records.map((record) =>
            VerificationFileMapper.toDomain(record)
        )
    }

    async deleteByDocumentId(documentId: string): Promise<boolean> {
        await db.orm.public.provider_verification_files
            .where({ document_id: documentId as never })
            .deleteAll();

        return true
    }
}
