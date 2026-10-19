import type { Prisma } from "@prisma/client";
import { ProviderAvailability, Weekday } from "../../domain/entities/providerAvailability.entity";

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
}
