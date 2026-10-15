import { VerificationFile } from "./verificationFile.entity";

export type VerificationDocumentType = 'IDENTITY' | 'CERTIFICATE';
export type VerificationDocumentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export class VerificationDocument {
    constructor(
        public readonly id: string,
        public readonly provider_id: string,
        public readonly document_type: VerificationDocumentType,
        public readonly document_name: string,
        public readonly status: VerificationDocumentStatus,
        public readonly rejection_reason: string | null,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly files?: VerificationFile[]
    ){}
}
