import type { Prisma } from "@prisma/client";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../../domain/entities/verificationDocument.entity";
import { VerificationFileMapper, VerificationFileRecord } from "./verificationFile.mapper";

export type VerificationDocumentRecord = Prisma.VerificationDocumentGetPayload<{}>;
export type VerificationDocumentRaw = VerificationDocumentRecord;

export class VerificationDocumentMapper {
    static toDomain(record: VerificationDocumentRecord): VerificationDocument {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new VerificationDocument(
            record.id,
            record.provider_id,
            record.document_type as VerificationDocumentType,
            record.document_name,
            record.status as VerificationDocumentStatus,
            record.rejection_reason ?? null,
            createdAtRaw && typeof createdAtRaw === "object" && "epochMilliseconds" in createdAtRaw
                ? new Date(Number(createdAtRaw.epochMilliseconds))
                : new Date(createdAtRaw),
            updatedAtRaw && typeof updatedAtRaw === "object" && "epochMilliseconds" in updatedAtRaw
                ? new Date(Number(updatedAtRaw.epochMilliseconds))
                : new Date(updatedAtRaw),
            record.files ? record.files.map((file: any) => VerificationFileMapper.toDomain(file as VerificationFileRecord)) : undefined
        );
    }
}
