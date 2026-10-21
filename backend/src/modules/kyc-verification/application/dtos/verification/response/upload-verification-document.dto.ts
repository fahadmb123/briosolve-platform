import { VerificationDocumentStatus, VerificationDocumentType } from "../../../../domain/entities/verificationDocument.entity";
import { VerificationFile } from "../../../../domain/entities/verificationFile.entity";

export interface UploadVerificationDocumentResponseDto {
    id: string,
    provider_id: string,
    document_type: VerificationDocumentType,
    document_name: string,
    status: VerificationDocumentStatus,
    rejection_reason: string | null,
    created_at: Date,
    updated_at: Date,
    files?: VerificationFile[]
}