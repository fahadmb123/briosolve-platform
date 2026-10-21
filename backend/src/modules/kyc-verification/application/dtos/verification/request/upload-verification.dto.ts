import { VerificationDocumentType } from "../../../../domain/entities/verificationDocument.entity";


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