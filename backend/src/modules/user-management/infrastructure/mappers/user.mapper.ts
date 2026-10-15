import { User } from "../../domain/entities/user.entity";
import { CustomerProfileMapper } from "./customerProfile.mapper";
import { ProviderProfileMapper, ProviderProfileRaw } from "./providerProfile.mapper";

export class UserMapper {
    static toDomain(raw: any): User {
        return new User(
            raw.id,
            raw.name,
            raw.email,
            raw.phone,
            raw.role,
            raw.status,
            raw.email_verified,
            raw.phone_verified,
            raw.current_address || raw.current_address_id,
            raw.created_at?.epochMilliseconds ? new Date(raw.created_at.epochMilliseconds) : new Date(raw.created_at),
            raw.updated_at?.epochMilliseconds ? new Date(raw.updated_at.epochMilliseconds) : new Date(raw.updated_at),
            raw.customer_profile ? CustomerProfileMapper.toDomain(raw.customer_profile) : null,
            raw.provider_profile ? ProviderProfileMapper.toDomain(raw.provider_profile as ProviderProfileRaw) : null
        );
    }
}
