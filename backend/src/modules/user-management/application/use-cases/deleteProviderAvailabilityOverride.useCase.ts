import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository.js";
import { DeleteAvailabilityOverrideInputDto } from "../Dto/providerDto.js";

export default class DeleteProviderAvailabilityOverrideUseCase implements IUseCase<DeleteAvailabilityOverrideInputDto, void> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: DeleteAvailabilityOverrideInputDto): Promise<void> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        await this.availabilityRepository.deleteOverride(profile.id, input.overrideId);
    }
}
