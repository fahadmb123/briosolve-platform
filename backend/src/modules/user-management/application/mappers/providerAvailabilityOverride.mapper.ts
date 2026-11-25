import { Temporal } from "@js-temporal/polyfill";
import type { Prisma } from "@prisma/client";
import { ProviderAvailabilityOverride, AvailabilityOverrideType } from "../../domain/entities/providerAvailabilityOverride.entity";
import { CreateAvailabilityOverrideInput } from "../../domain/repositories/IProviderAvailabilityRepository";

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

    static toPersistence(providerId: string, data: CreateAvailabilityOverrideInput) {
        return {
            provider_id: providerId as never,
            override_date: Temporal.Instant.from(data.override_date.toISOString()),
            type: data.type as never,
            start_time: (data.start_time || null) as never,
            end_time: (data.end_time || null) as never,
            reason: (data.reason || null) as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        };
    }
}
