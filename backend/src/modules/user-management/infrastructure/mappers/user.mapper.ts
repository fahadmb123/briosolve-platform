import type { Prisma } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { CustomerProfileMapper, CustomerProfileRecord } from "./customerProfile.mapper";
import { ProviderProfileMapper, ProviderProfileRecord } from "./providerProfile.mapper";

export type UserRecord = Prisma.UserGetPayload<{}>;

export class UserMapper {
    static toDomain(record: UserRecord): User {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new User(
            record.id,
            record.name,
            record.email,
            record.phone ?? null,
            record.role,
            record.status,
            record.email_verified,
            record.phone_verified,
            (record as any).current_address || record.current_address_id,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw),
            record.customer_profile ? CustomerProfileMapper.toDomain(record.customer_profile as CustomerProfileRecord) : null,
            record.provider_profile ? ProviderProfileMapper.toDomain(record.provider_profile as ProviderProfileRecord) : null
        );
    }
}
