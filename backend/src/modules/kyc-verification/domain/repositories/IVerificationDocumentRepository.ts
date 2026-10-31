import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { GetAdminKycRequestsInput } from "../../application/dtos/admin/request/get-admin-kyc.dto";
import { GetAdminKycResponse } from "../../application/dtos/admin/response/get-admin-kyc.dto";
import { CreateVerificationDocumentInputDto } from "../../application/dtos/verification-document/request/create-verification-document.dto";
import { UpdateVerificationDocumentRepositoryDto } from "../../application/dtos/verification-document/request/update-veridication-document-repository.dto";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../entities/verificationDocument.entity";
import { VerificationProfile } from "../entities/verificationProfile.entity";

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
    resolveProviderUserId(providerId: string): Promise<string>;
    updateDocumentStatus(input: UpdateDocumentStatusInput): Promise<void>;
    updateProviderKycStatus(profileId: string, kycStatus: string): Promise<void>;
    deleteByProviderId(providerId: string): Promise<void>;
}
