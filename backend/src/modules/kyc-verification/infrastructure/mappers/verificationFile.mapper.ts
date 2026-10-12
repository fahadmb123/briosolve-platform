import { VerificationFile } from "../../domain/entities/verificationFile.entity.js";
import { VerificationFileRaw } from "../../application/Dto/verificationDto.js";

export class VerificationFileMapper {
    static toDomain(raw: VerificationFileRaw): VerificationFile {
        return new VerificationFile(
            raw.id,
            raw.document_id,
            raw.file_url,
            raw.created_at && typeof raw.created_at === "object" && "epochMilliseconds" in raw.created_at
                ? new Date(raw.created_at.epochMilliseconds)
                : new Date(raw.created_at)
        );
    }
}
