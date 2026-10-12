import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { VerificationDocument, VerificationDocumentType, VerificationDocumentStatus } from "../entities/verificationDocument.entity.js";
import { CreateVerificationDocumentInputDto, UpdateVerificationDocumentRepositoryDto } from "../../application/Dto/verificationDto.js";

export interface IVerificationDocumentRepository extends BaseRepository<VerificationDocument | null> {
    findById(id: string): Promise<VerificationDocument | null>;
    findByProviderId(providerId: string): Promise<VerificationDocument[]>;
    findByProviderAndType(providerId: string, documentType: VerificationDocumentType): Promise<VerificationDocument | null>;
    createOrUpdate(input: CreateVerificationDocumentInputDto): Promise<VerificationDocument>;
    updateDocument(id: string, input: UpdateVerificationDocumentRepositoryDto): Promise<VerificationDocument | null>;
    updateStatus(id: string, status: VerificationDocumentStatus, rejectionReason?: string | null): Promise<VerificationDocument | null>;
    deleteDocument(id: string): Promise<boolean>;
}
