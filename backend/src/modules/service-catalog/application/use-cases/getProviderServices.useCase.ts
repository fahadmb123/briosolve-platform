import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";

export class GetProviderServicesUseCase implements IUseCase<string, ProviderService[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository
    ){}

    async execute(userId: string): Promise<ProviderService[]> {
        return await this.providerServiceRepository.getProviderServices(userId);
    }
}
