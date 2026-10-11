import { ProviderAvailability, Weekday } from "../entities/providerAvailability.entity.js";

export interface AvailabilitySlotInput {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export interface IProviderAvailabilityRepository {
    findByProviderId(providerId: string): Promise<ProviderAvailability[]>;
    setAvailability(providerId: string, slots: AvailabilitySlotInput[]): Promise<ProviderAvailability[]>;
}
