import { ProviderAvailabilityOverride, AvailabilityOverrideType } from "../../domain/entities/providerAvailabilityOverride.entity";

export interface ProviderAvailabilityOverrideRaw {
    id: string;
    provider_id: string;
    override_date: Date | { epochMilliseconds: number } | string;
    type: AvailabilityOverrideType;
    start_time: string | null;
    end_time: string | null;
    reason: string | null;
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
}

export class ProviderAvailabilityOverrideMapper {
    static toDomain(raw: ProviderAvailabilityOverrideRaw): ProviderAvailabilityOverride {
        const parseDate = (val: Date | { epochMilliseconds: number } | string) => {
            if (val && typeof val === "object" && "epochMilliseconds" in val) {
                return new Date(val.epochMilliseconds);
            }
            return new Date(val);
        };

        return new ProviderAvailabilityOverride(
            raw.id,
            raw.provider_id,
            parseDate(raw.override_date),
            raw.type,
            raw.start_time,
            raw.end_time,
            raw.reason,
            parseDate(raw.created_at),
            parseDate(raw.updated_at)
        );
    }
}
