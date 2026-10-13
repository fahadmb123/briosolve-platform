import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export interface UpdateKycStatusInput {
    providerId: string;
    status: "APPROVED" | "REJECTED";
    rejectionReason?: string;
    documentId: string;
}

export class UpdateKycStatusUseCase implements IUseCase<UpdateKycStatusInput, void> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository
    ) {}

    async execute(input: UpdateKycStatusInput): Promise<void> {
        if (!input.providerId) throw new ApplicationError("BAD_REQUEST", "Provider ID is required", "VALIDATION");

        if (input.status !== "APPROVED" && input.status !== "REJECTED") throw new ApplicationError("BAD_REQUEST", "Invalid KYC status", "VALIDATION");

        if (input.status === "REJECTED" && !input.rejectionReason?.trim()) throw new ApplicationError("BAD_REQUEST", "Rejection reason is required when rejecting a document", "VALIDATION");

        const profileId = await this.verificationDocumentRepository.resolveProviderProfileId(input.providerId);

        await this.verificationDocumentRepository.updateDocumentStatus({
            documentId: input.documentId,
            status: input.status,
            rejectionReason: input.status === "REJECTED" ? input.rejectionReason || "Verification rejected" : null,
        });

        const allDocs = await this.verificationDocumentRepository.findByProviderId(profileId);

        const hasIdentityApproved = allDocs.some((d) => d.document_type === "IDENTITY" && d.status === "APPROVED");
        const hasCertificateApproved = allDocs.some((d) => d.document_type === "CERTIFICATE" && d.status === "APPROVED");
        const bothApproved = hasIdentityApproved && hasCertificateApproved;
        const allRejected = allDocs.length > 0 && allDocs.every((d) => d.status === "REJECTED");

        const newKycStatus = bothApproved
            ? "APPROVED"
            : allRejected
            ? "REJECTED"
            : allDocs.length > 0
            ? "PENDING"
            : "NOT_SUBMITTED";

        await this.verificationDocumentRepository.updateProviderKycStatus(profileId, newKycStatus);
    }
}
