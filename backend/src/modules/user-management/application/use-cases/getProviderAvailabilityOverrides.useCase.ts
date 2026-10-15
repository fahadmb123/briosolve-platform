import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository";
import { ProviderAvailabilityOverride } from "../../domain/entities/providerAvailabilityOverride.entity";
import { GetAvailabilityOverridesInputDto } from "../Dto/providerDto";

export default class GetProviderAvailabilityOverridesUseCase implements IUseCase<GetAvailabilityOverridesInputDto, ProviderAvailabilityOverride[]> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: GetAvailabilityOverridesInputDto): Promise<ProviderAvailabilityOverride[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        return await this.availabilityRepository.findOverridesByProviderId(profile.id);
    }
}
