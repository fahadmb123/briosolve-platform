import { ProviderAvailability, Weekday } from "../entities/providerAvailability.entity";
import { ProviderAvailabilityOverride, AvailabilityOverrideType } from "../entities/providerAvailabilityOverride.entity";

export interface AvailabilitySlotInput {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export interface CreateAvailabilityOverrideInput {
    override_date: Date;
    type: AvailabilityOverrideType;
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
}

export interface IProviderAvailabilityRepository {
    findByProviderId(providerId: string): Promise<ProviderAvailability[]>;
    setAvailability(providerId: string, slots: AvailabilitySlotInput[]): Promise<ProviderAvailability[]>;
    findOverridesByProviderId(providerId: string): Promise<ProviderAvailabilityOverride[]>;
    createOverride(providerId: string, data: CreateAvailabilityOverrideInput): Promise<ProviderAvailabilityOverride>;
    deleteOverride(providerId: string, overrideId: string): Promise<void>;
}
