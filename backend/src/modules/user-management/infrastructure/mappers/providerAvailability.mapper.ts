import { ProviderAvailability, Weekday } from "../../domain/entities/providerAvailability.entity.js";

export interface ProviderAvailabilityRaw {
    id: string;
    provider_id: string;
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
}

export class ProviderAvailabilityMapper {
    static toDomain(raw: ProviderAvailabilityRaw): ProviderAvailability {
        return new ProviderAvailability(
            raw.id,
            raw.provider_id,
            raw.day_of_week,
            raw.start_time,
            raw.end_time,
            raw.created_at && typeof raw.created_at === "object" && "epochMilliseconds" in raw.created_at
                ? new Date(raw.created_at.epochMilliseconds)
                : new Date(raw.created_at),
            raw.updated_at && typeof raw.updated_at === "object" && "epochMilliseconds" in raw.updated_at
                ? new Date(raw.updated_at.epochMilliseconds)
                : new Date(raw.updated_at)
        );
    }
}
