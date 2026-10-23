import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import { GetAvailabilityOverridesInputDto } from "../../dtos/request/provider/get-availability-override.dto";
import { ProviderAvailabilityOverrideResponseDto } from "../../dtos/response/provider/provider-availability-override.dto";


export default class GetProviderAvailabilityOverridesUseCase implements IUseCase<GetAvailabilityOverridesInputDto, ProviderAvailabilityOverrideResponseDto[]> {
    constructor(
        private readonly _providerRepository: IProviderRepository,
        private readonly _availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: GetAvailabilityOverridesInputDto): Promise<ProviderAvailabilityOverrideResponseDto[]> {
        const profile = await this._providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        return await this._availabilityRepository.findOverridesByProviderId(profile.id);
    }
}
