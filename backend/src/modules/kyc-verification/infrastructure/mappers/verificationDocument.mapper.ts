import { VerificationDocument } from "../../domain/entities/verificationDocument.entity.js";
import { VerificationDocumentRaw } from "../../application/Dto/verificationDto.js";
import { VerificationFileMapper } from "./verificationFile.mapper.js";

export class VerificationDocumentMapper {
    static toDomain(raw: VerificationDocumentRaw): VerificationDocument {
        return new VerificationDocument(
            raw.id,
            raw.provider_id,
            raw.document_type,
            raw.document_name,
            raw.status,
            raw.rejection_reason,
            raw.created_at && typeof raw.created_at === "object" && "epochMilliseconds" in raw.created_at
                ? new Date(raw.created_at.epochMilliseconds)
                : new Date(raw.created_at),
            raw.updated_at && typeof raw.updated_at === "object" && "epochMilliseconds" in raw.updated_at
                ? new Date(raw.updated_at.epochMilliseconds)
                : new Date(raw.updated_at),
            raw.files ? raw.files.map((file) => VerificationFileMapper.toDomain(file)) : undefined
        );
    }
}
