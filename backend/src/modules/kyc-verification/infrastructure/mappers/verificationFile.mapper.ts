import type { Prisma } from "@prisma/client";
import { VerificationFile } from "../../domain/entities/verificationFile.entity";

export type VerificationFileRecord = Prisma.VerificationFileGetPayload<{}>;
export type VerificationFileRaw = VerificationFileRecord;

export class VerificationFileMapper {
    static toDomain(record: VerificationFileRecord): VerificationFile {
        const createdAtRaw: any = record.created_at;

        return new VerificationFile(
            record.id,
            record.document_id,
            record.file_url,
            createdAtRaw && typeof createdAtRaw === "object" && "epochMilliseconds" in createdAtRaw
                ? new Date(Number(createdAtRaw.epochMilliseconds))
                : new Date(createdAtRaw)
        );
    }
}
