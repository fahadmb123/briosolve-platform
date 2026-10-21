import type { Prisma } from "@prisma/client";
import { User } from "../../domain/entities/user.entity";
import { CustomerProfileMapper, CustomerProfileRecord } from "./customerProfile.mapper";
import { ProviderProfileMapper, ProviderProfileRecord } from "./providerProfile.mapper";
import { UserResponseDto } from "../../../user-management/application/dtos/response/user/user-dto";


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
            record.password_hash,
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

    static toDto(user: User): UserResponseDto{
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role as "CUSTOMER" | "ADMIN" | "INVESTIGATOR" | "PROVIDER",
            status: user.status as "ACTIVE" | "INACTIVE" | "BLOCKED",
            email_verified: user.email_verified,
            phone_verified: user.phone_verified,
            current_address_id: user.current_address_id,
            created_at: user.created_at,
            updated_at: user.updated_at,
            customer_profile: user.customer_profile,
            provider_profile: user.provider_profile
        };
    }
}