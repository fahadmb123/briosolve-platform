import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { CreateVerificationDocumentInputDto } from "../../application/dtos/verification-document/request/create-verification-document.dto";
import { UpdateVerificationDocumentRepositoryDto } from "../../application/dtos/verification-document/request/update-veridication-document-repository.dto";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../entities/verificationDocument.entity";
import { VerificationProfile } from "../entities/verificationProfile.entity";



export interface GetAdminKycRequestsInput {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sort?: "asc" | "desc";
}

export interface AdminKycDossier {
    id: string;
    user_id: string;
    business_name: string;
    experience: string;
    bio: string;
    profile_image: string | null;
    kyc_status: string;
    created_at: Date | string;
    updated_at: Date | string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
    };
    services?: Array<{
        id: string;
        name: string;
    }>;
    documents: Array<{
        id: string;
        document_type: string;
        document_name: string;
        status: string;
        rejection_reason: string | null;
        created_at: Date | string;
        files: Array<{
            id: string;
            file_url: string;
        }>;
    }>;
}

export interface AdminKycStats {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
}

export interface GetAdminKycResponse {
    dossiers: AdminKycDossier[];
    total: number;
    totalPages: number;
    stats: AdminKycStats;
}

export interface UpdateDocumentStatusInput {
    documentId: string;
    status: "APPROVED" | "REJECTED";
    rejectionReason?: string | null;
}

export interface IVerificationDocumentRepository extends BaseRepository<VerificationDocument | null> {
    findByProviderId(providerId: string): Promise<VerificationDocument[]>;
    findByProviderAndType(providerId: string, documentType: VerificationDocumentType): Promise<VerificationDocument | null>;
    createOrUpdate(input: CreateVerificationDocumentInputDto): Promise<VerificationDocument>;
    updateDocument(id: string, input: UpdateVerificationDocumentRepositoryDto): Promise<VerificationDocument | null>;
    updateStatus(id: string, status: VerificationDocumentStatus, rejectionReason?: string | null): Promise<VerificationDocument | null>;
    deleteDocument(id: string): Promise<boolean>;
    getAdminKycRequests(input: GetAdminKycRequestsInput): Promise<GetAdminKycResponse>;
    getAllProfilesWithVerifications(): Promise<VerificationProfile[]>;
    resolveProviderProfileId(providerId: string): Promise<string>;
    updateDocumentStatus(input: UpdateDocumentStatusInput): Promise<void>;
    updateProviderKycStatus(profileId: string, kycStatus: string): Promise<void>;
}
