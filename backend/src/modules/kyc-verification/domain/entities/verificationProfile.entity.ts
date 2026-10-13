import { VerificationDocument } from "./verificationDocument.entity.js";

export interface VerificationProfileUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
}

export interface VerificationProfileService {
    id: string;
    name: string;
}

export class VerificationProfile {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly business_name: string,
        public readonly experience: string,
        public readonly bio: string,
        public readonly profile_image: string | null,
        public readonly kyc_status: string,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly user: VerificationProfileUser,
        public readonly services: VerificationProfileService[],
        public readonly documents: VerificationDocument[]
    ) {}

    hasUploadedDocuments(): boolean {
        return this.documents.length > 0;
    }

    hasPendingDocuments(): boolean {
        return this.documents.some((doc) => doc.status === "PENDING");
    }

    areAllDocumentsApproved(): boolean {
        return this.documents.length > 0 && this.documents.every((doc) => doc.status === "APPROVED");
    }

    hasRejectedDocuments(): boolean {
        return this.documents.some((doc) => doc.status === "REJECTED");
    }

    getEffectiveKycStatus(): string {
        if (this.hasPendingDocuments()) {
            return "PENDING";
        }
        const hasIdentity = this.documents.some((d) => d.document_type === "IDENTITY" && d.status === "APPROVED");
        const hasCertificate = this.documents.some((d) => d.document_type === "CERTIFICATE" && d.status === "APPROVED");
        if (hasIdentity && hasCertificate) {
            return "APPROVED";
        }
        if (this.documents.length > 0 && this.documents.every((d) => d.status === "REJECTED")) {
            return "REJECTED";
        }
        if (this.areAllDocumentsApproved()) {
            return "APPROVED";
        }
        return this.kyc_status;
    }

    matchesSearch(query: string): boolean {
        const q = query.trim().toLowerCase();
        return (
            this.user.email.toLowerCase().includes(q) ||
            this.user.name.toLowerCase().includes(q) ||
            this.business_name.toLowerCase().includes(q)
        );
    }
}
