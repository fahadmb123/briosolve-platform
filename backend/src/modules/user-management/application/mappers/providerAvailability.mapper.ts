import { Temporal } from "@js-temporal/polyfill";
import type { Prisma } from "@prisma/client";
import { ProviderAvailability, Weekday } from "../../domain/entities/providerAvailability.entity";
import { AvailabilitySlotInput } from "../../domain/repositories/IProviderAvailabilityRepository";

export type ProviderAvailabilityRecord = Prisma.ProviderAvailabilityGetPayload<{}>;
export type ProviderAvailabilityRaw = ProviderAvailabilityRecord;

export class ProviderAvailabilityMapper {
    static toDomain(record: ProviderAvailabilityRecord): ProviderAvailability {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new ProviderAvailability(
            record.id,
            record.provider_id,
            record.day_of_week as Weekday,
            record.start_time,
            record.end_time,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw)
        );
    }

    static toPersistence(providerId: string, slot: AvailabilitySlotInput) {
        return {
            provider_id: providerId as never,
            day_of_week: slot.day_of_week as never,
            start_time: slot.start_time as never,
            end_time: slot.end_time as never,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant()
        };
    }
}
