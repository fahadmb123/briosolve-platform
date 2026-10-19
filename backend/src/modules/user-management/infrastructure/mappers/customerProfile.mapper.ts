import type { Prisma } from "@prisma/client";
import { CustomerProfile } from "../../domain/entities/customerProfile.entity";

export type CustomerProfileRecord = Prisma.CustomerProfileGetPayload<{}>;

export class CustomerProfileMapper {
    static toDomain(record: CustomerProfileRecord): CustomerProfile {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new CustomerProfile(
            record.id,
            record.user_id,
            (record as any).current_address_id ?? null,
            record.profile_image ?? null,
            record.about,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.service_radius_km ?? null
        );
    }
}
