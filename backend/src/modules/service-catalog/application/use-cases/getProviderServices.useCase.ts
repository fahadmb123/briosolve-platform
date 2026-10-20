import { IUseCase } from "../../../../shared/domain/interfaces/use-cases/IUseCase";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

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
