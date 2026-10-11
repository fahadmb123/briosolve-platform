import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js";

export class CustomerProfileMapper {
    static toDomain(raw: any): CustomerProfile {
        return new CustomerProfile(
            raw.id,
            raw.user_id,
            raw.current_address_id,
            raw.profile_image,
            raw.about,
            raw.created_at?.epochMilliseconds ? new Date(raw.created_at.epochMilliseconds) : new Date(raw.created_at),
            raw.updated_at?.epochMilliseconds ? new Date(raw.updated_at.epochMilliseconds) : new Date(raw.updated_at),
            raw.service_radius_km
        );
    }
}
