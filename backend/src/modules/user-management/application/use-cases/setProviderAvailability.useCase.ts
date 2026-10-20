import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository";
import { ProviderAvailability } from "../../domain/entities/providerAvailability.entity";
import { SetProviderAvailabilityInputDto } from "../dtos/providerDto";

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
