import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository";
import { ProviderAvailability } from "../../domain/entities/providerAvailability.entity";
import { GetProviderAvailabilityInputDto } from "../Dto/providerDto";

export default class GetProviderAvailabilityUseCase implements IUseCase<GetProviderAvailabilityInputDto, ProviderAvailability[]> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: GetProviderAvailabilityInputDto): Promise<ProviderAvailability[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        return await this.availabilityRepository.findByProviderId(profile.id);
    }
}
