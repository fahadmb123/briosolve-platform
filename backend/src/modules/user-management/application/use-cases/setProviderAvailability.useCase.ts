import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository.js";
import { ProviderAvailability } from "../../domain/entities/providerAvailability.entity.js";
import { SetProviderAvailabilityInputDto } from "../Dto/providerDto.js";

export default class SetProviderAvailabilityUseCase implements IUseCase<SetProviderAvailabilityInputDto, ProviderAvailability[]> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: SetProviderAvailabilityInputDto): Promise<ProviderAvailability[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        return await this.availabilityRepository.setAvailability(profile.id, input.slots);
    }
}
