import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../../domain/repositories/IProviderAvailabilityRepository";
import { DeleteAvailabilityOverrideInputDto } from "../../dtos/request/provider/delete-availability-override.dto";



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
