import type { Prisma } from "@prisma/client";
import { Address } from "../../domain/entities/address.entity";

export type AddressRecord = Prisma.AddressGetPayload<{}>;

export class AddressMapper {
    static toDomain(record: AddressRecord): Address {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new Address(
            record.id,
            record.user_id,
            record.house_no ?? null,
            record.area,
            record.city,
            record.district,
            record.state,
            record.country,
            record.pincode,
            record.landmark ?? null,
            record.type,
            record.latitude ? Number(record.latitude) : null,
            record.longitude ? Number(record.longitude) : null,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw)
        );
    }
}
