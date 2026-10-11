import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";
import { AddProviderServicesInputDto } from "../Dto/providerService.js";

export class AddProviderServicesUseCase implements IUseCase<AddProviderServicesInputDto, ProviderService[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository
    ){}

    async execute(input: AddProviderServicesInputDto): Promise<ProviderService[]> {
        return await this.providerServiceRepository.addProviderServices(input.userId, input.serviceIds);
    }
}
