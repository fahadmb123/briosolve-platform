import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

export interface UpdateKycStatusInput {
    providerId: string;
    status: "APPROVED" | "REJECTED";
    rejectionReason?: string;
    documentId: string;
}

export class UpdateKycStatusUseCase implements IUseCase<UpdateKycStatusInput, void> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository
    ) {}

    async execute(input: UpdateKycStatusInput): Promise<void> {
        if (!input.providerId) throw new ApplicationError("BAD_REQUEST", "Provider ID is required", "VALIDATION");

        if (input.status !== "APPROVED" && input.status !== "REJECTED") throw new ApplicationError("BAD_REQUEST", "Invalid KYC status", "VALIDATION");

        if (input.status === "REJECTED" && !input.rejectionReason?.trim()) throw new ApplicationError("BAD_REQUEST", "Rejection reason is required when rejecting a document", "VALIDATION");

        const profileId = await this._verificationDocumentRepository.resolveProviderProfileId(input.providerId);

        await this._verificationDocumentRepository.updateDocumentStatus({
            documentId: input.documentId,
            status: input.status,
            rejectionReason: input.status === "REJECTED" ? input.rejectionReason || "Verification rejected" : null,
        });

        const allDocs = await this._verificationDocumentRepository.findByProviderId(profileId);

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

        await this._verificationDocumentRepository.updateProviderKycStatus(profileId, newKycStatus);
    }
}
