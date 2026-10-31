import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { logger } from "../../../../shared/infrastructure/logger/logger";

export interface UpdateKycStatusInput {
    providerId: string;
    status: "APPROVED" | "REJECTED";
    rejectionReason?: string;
    documentId: string;
}

export class UpdateKycStatusUseCase implements IUseCase<UpdateKycStatusInput, void> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly _createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: UpdateKycStatusInput): Promise<void> {
        if (!input.providerId) throw new ApplicationError("BAD_REQUEST", "Provider ID is required", "VALIDATION");

        if (input.status !== "APPROVED" && input.status !== "REJECTED") throw new ApplicationError("BAD_REQUEST", "Invalid KYC status", "VALIDATION");

        if (input.status === "REJECTED" && !input.rejectionReason?.trim()) throw new ApplicationError("BAD_REQUEST", "Rejection reason is required when rejecting a document", "VALIDATION");

        const profileId = await this._verificationDocumentRepository.resolveProviderProfileId(input.providerId);
        const userId = await this._verificationDocumentRepository.resolveProviderUserId(input.providerId);

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

        const isApproved = input.status === "APPROVED";

        const notification = {
            recipientId: userId,
            type: isApproved ? "SUCCESS" : "ERROR",
            title_code: isApproved ? "KYC_APPROVED" : "KYC_REJECTED",
            title: isApproved ? "KYC Verification Approved" : "KYC Verification Rejected",
            message: isApproved
                ? (bothApproved
                    ? "Your KYC verification is complete and your provider account is fully verified."
                    : "Your KYC verification document has been approved.")
                : input.rejectionReason || "Your KYC verification document was rejected.",
        } as const;

        try {
            await this._createNotificationUseCase.execute(notification);
        } catch (error) {
            logger.error(
                { err: error, userId },
                "Failed to create KYC status notification",
            );
        }
    }
}
