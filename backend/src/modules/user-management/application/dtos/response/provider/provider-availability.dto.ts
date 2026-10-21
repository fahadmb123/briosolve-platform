import { Weekday } from "../../../../domain/entities/providerAvailability.entity";

export interface ProviderAvailabilityResponseDto {
    id: string,
    provider_id: string,
    day_of_week: Weekday,
    start_time: string,
    end_time: string,
    created_at: Date,
    updated_at: Date
}