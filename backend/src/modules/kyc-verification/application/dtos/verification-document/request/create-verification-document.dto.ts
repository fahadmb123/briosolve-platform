import { VerificationDocumentType } from "../../../../domain/entities/verificationDocument.entity";

export interface CreateVerificationDocumentInputDto {
    provider_id: string;
    document_type: VerificationDocumentType;
    document_name: string;
    file_urls: string[];
}