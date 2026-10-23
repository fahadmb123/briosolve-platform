import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { VerificationDocument } from "../../domain/entities/verificationDocument.entity";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { UploadVerificationDocumentResponseDto } from "../dtos/verification/response/upload-verification-document.dto";

export class GetProviderVerificationsUseCase implements IUseCase<string, UploadVerificationDocumentResponseDto[]> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly _providerRepository: IProviderRepository
    ){}

    async execute(userId: string): Promise<UploadVerificationDocumentResponseDto[]> {
        const provider = await this._providerRepository.findById(userId);
        if (!provider) {
            return [];
        }

        return await this._verificationDocumentRepository.findByProviderId(provider.id);
    }
}
