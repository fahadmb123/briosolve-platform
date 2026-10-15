import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { VerificationDocument } from "../../domain/entities/verificationDocument.entity";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";

export class GetProviderVerificationsUseCase implements IUseCase<string, VerificationDocument[]> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly providerRepository: IProviderRepository
    ){}

    async execute(userId: string): Promise<VerificationDocument[]> {
        const provider = await this.providerRepository.findById(userId);
        if (!provider) {
            return [];
        }

        return await this.verificationDocumentRepository.findByProviderId(provider.id);
    }
}
