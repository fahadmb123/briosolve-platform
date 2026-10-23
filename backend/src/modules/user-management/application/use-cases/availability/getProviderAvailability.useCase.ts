import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import { GetProviderAvailabilityInputDto } from "../../dtos/request/provider/get-provider-availability.dto";
import { ProviderAvailabilityResponseDto } from "../../dtos/response/provider/provider-availability.dto";

export default class GetProviderAvailabilityUseCase implements IUseCase<GetProviderAvailabilityInputDto, ProviderAvailabilityResponseDto[]> {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: GetProviderAvailabilityInputDto): Promise<ProviderAvailabilityResponseDto[]> {
        const profile = await this._providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        return await this._availabilityRepository.findByProviderId(profile.id);
    }
}
