import type { Prisma } from "@prisma/client";
import { ProviderAvailabilityOverride, AvailabilityOverrideType } from "../../domain/entities/providerAvailabilityOverride.entity";

export type ProviderAvailabilityOverrideRecord = Prisma.ProviderAvailabilityOverrideGetPayload<{}>;
export type ProviderAvailabilityOverrideRaw = ProviderAvailabilityOverrideRecord;

export class ProviderAvailabilityOverrideMapper {
    static toDomain(record: ProviderAvailabilityOverrideRecord): ProviderAvailabilityOverride {
        const parseDate = (val: any) => {
            if (val && typeof val === "object" && "epochMilliseconds" in val) {
                return new Date(Number(val.epochMilliseconds));
            }
            return new Date(val);
        };

        return new ProviderAvailabilityOverride(
            record.id,
            record.provider_id,
            parseDate(record.override_date),
            record.type as AvailabilityOverrideType,
            record.start_time ?? null,
            record.end_time ?? null,
            record.reason ?? null,
            parseDate(record.created_at),
            parseDate(record.updated_at)
        );
    }
}
