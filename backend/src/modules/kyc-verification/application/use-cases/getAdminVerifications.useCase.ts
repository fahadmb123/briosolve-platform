import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IVerificationDocumentRepository, GetAdminKycRequestsInput, GetAdminKycResponse } from "../../domain/repositories/IVerificationDocumentRepository.js";

export class GetAdminVerificationsUseCase implements IUseCase<GetAdminKycRequestsInput, GetAdminKycResponse> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository
    ) {}

    async execute(input: GetAdminKycRequestsInput): Promise<GetAdminKycResponse> {
        return await this.verificationDocumentRepository.getAdminKycRequests(input);
    }
}
