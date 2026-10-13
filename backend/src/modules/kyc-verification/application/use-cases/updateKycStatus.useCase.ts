import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IVerificationDocumentRepository, UpdateKycStatusInput } from "../../domain/repositories/IVerificationDocumentRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class UpdateKycStatusUseCase implements IUseCase<UpdateKycStatusInput, void> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository
    ) {}

    async execute(input: UpdateKycStatusInput): Promise<void> {
        if (!input.providerId) throw new ApplicationError("BAD_REQUEST", "Provider ID is required", "VALIDATION")

        if (input.status !== "APPROVED" && input.status !== "REJECTED") throw new ApplicationError("BAD_REQUEST", "Invalid KYC status", "VALIDATION")

        if (input.status === "REJECTED" && !input.rejectionReason?.trim()) throw new ApplicationError("BAD_REQUEST", "Rejection reason is required when rejecting KYC", "VALIDATION")

        await this.verificationDocumentRepository.updateKycStatus(input)
    }
}
