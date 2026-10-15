import { VerificationDocumentType, VerificationDocumentStatus } from "../../domain/entities/verificationDocument.entity";

export interface UploadVerificationInputDto {
    userId: string;
    document_type: VerificationDocumentType;
    document_name: string;
    files: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }[];
}

export interface UpdateVerificationInputDto {
    id: string;
    userId: string;
    document_name?: string;
    kept_file_ids?: string[];
    new_files?: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }[];
}

export interface CreateVerificationDocumentInputDto {
    provider_id: string;
    document_type: VerificationDocumentType;
    document_name: string;
    file_urls: string[];
}

export interface UpdateVerificationDocumentRepositoryDto {
    document_name?: string;
    kept_file_ids?: string[];
    new_file_urls?: string[];
}

export interface VerificationFileRaw {
    id: string;
    document_id: string;
    file_url: string;
    created_at: Date | { epochMilliseconds: number } | string;
}

export interface VerificationDocumentRaw {
    id: string;
    provider_id: string;
    document_type: VerificationDocumentType;
    document_name: string;
    status: VerificationDocumentStatus;
    rejection_reason: string | null;
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
    files?: VerificationFileRaw[];
}
