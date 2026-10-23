import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { AddProviderServicesInputDto } from "../dtos/provider/request/add-provider-service.dto";
import { ProviderServiceResponseDto } from "../dtos/provider/response/provider-service.dto";

export class AddProviderServicesUseCase implements IUseCase<AddProviderServicesInputDto, ProviderServiceResponseDto[]> {
    constructor(
        private readonly _providerServiceRepository: IProviderServiceRepository,
        private readonly _providerRepository: IProviderRepository
    ){}

    async execute(input: AddProviderServicesInputDto): Promise<ProviderServiceResponseDto[]> {
        const profile = await this._providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }
        return await this._providerServiceRepository.addProviderServices(profile.id, input.serviceIds);
    }
}
