import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class GetProviderServicesUseCase implements IUseCase<string, ProviderService[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly providerRepository: IProviderRepository
    ){}

    async execute(userId: string): Promise<ProviderService[]> {
        const profile = await this.providerRepository.findById(userId);
        if (!profile) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }
        return await this.providerServiceRepository.getProviderServices(profile.id);
    }
}
