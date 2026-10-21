import { AvailabilityOverrideType } from "../../../../domain/entities/providerAvailabilityOverride.entity";

export interface ProviderAvailabilityOverrideResponseDto{
    id: string,
    provider_id: string,
    override_date: Date,
    type: AvailabilityOverrideType,
    start_time: string | null,
    end_time: string | null,
    reason: string | null,
    created_at?: Date,
    updated_at?: Date
}