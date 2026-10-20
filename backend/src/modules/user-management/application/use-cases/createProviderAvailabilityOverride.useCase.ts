import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository";
import { IProviderAvailabilityRepository } from "../../domain/repositories/IProviderAvailabilityRepository";
import { ProviderAvailabilityOverride } from "../../domain/entities/providerAvailabilityOverride.entity";
import { CreateAvailabilityOverrideInputDto } from "../Dto/providerDto";

export default class CreateProviderAvailabilityOverrideUseCase implements IUseCase<CreateAvailabilityOverrideInputDto, ProviderAvailabilityOverride> {
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly availabilityRepository: IProviderAvailabilityRepository
    ) {}

    async execute(input: CreateAvailabilityOverrideInputDto): Promise<ProviderAvailabilityOverride> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("PROVIDER_NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const targetDate = new Date(input.override_date);
        const targetIsoDate = targetDate.toISOString().split("T")[0];
        const existingOverrides = await this.availabilityRepository.findOverridesByProviderId(profile.id);
        const isDuplicate = existingOverrides.some((o) => o.override_date.toISOString().split("T")[0] === targetIsoDate);
        if (isDuplicate) {
            throw new ApplicationError("OVERRIDE_ALREADY_EXISTS", "An override already exists for this date", "CONFLICT");
        }

        if (input.type === "CUSTOM_HOURS") {
            if (!input.start_time || !input.end_time) {
                throw new ApplicationError("INVALID_HOURS", "Start time and end time are required for custom hours", "VALIDATION");
            }
            if (input.start_time >= input.end_time) {
                throw new ApplicationError("INVALID_HOURS", "End time must be after start time", "VALIDATION");
            }
        }

        return await this.availabilityRepository.createOverride(profile.id, {
            override_date: targetDate,
            type: input.type,
            start_time: input.type === "CUSTOM_HOURS" ? input.start_time : null,
            end_time: input.type === "CUSTOM_HOURS" ? input.end_time : null,
            reason: input.reason
        });
    }
}
