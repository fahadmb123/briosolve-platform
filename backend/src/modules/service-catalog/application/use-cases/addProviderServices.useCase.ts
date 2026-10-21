import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { AddProviderServicesInputDto } from "../dtos/provider/request/add-provider-service.dto";

export class AddProviderServicesUseCase implements IUseCase<AddProviderServicesInputDto, ProviderService[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly providerRepository: IProviderRepository
    ){}

    async execute(input: AddProviderServicesInputDto): Promise<ProviderService[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }
        return await this.providerServiceRepository.addProviderServices(profile.id, input.serviceIds);
    }
}
