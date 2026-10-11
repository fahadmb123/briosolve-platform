import { ProviderProfile } from "../../domain/entities/providerProfile.entity.js";

export interface ProviderProfileRaw {
    id: string;
    user_id: string;
    business_name: string;
    experience: string;
    bio: string;
    profile_image: string | null;
    service_radius_km?: number | null;
    accepting_leads?: boolean;
    travel_buffer_minutes?: number;
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
}

export class ProviderProfileMapper {
    static toDomain(raw: ProviderProfileRaw): ProviderProfile {
        return new ProviderProfile(
            raw.id,
            raw.user_id,
            raw.business_name,
            raw.experience,
            raw.bio,
            raw.profile_image,
            raw.created_at && typeof raw.created_at === "object" && "epochMilliseconds" in raw.created_at
                ? new Date(raw.created_at.epochMilliseconds)
                : new Date(raw.created_at),
            raw.updated_at && typeof raw.updated_at === "object" && "epochMilliseconds" in raw.updated_at
                ? new Date(raw.updated_at.epochMilliseconds)
                : new Date(raw.updated_at),
            raw.service_radius_km !== undefined && raw.service_radius_km !== null
                ? Number(raw.service_radius_km)
                : 20,
            raw.accepting_leads !== undefined ? Boolean(raw.accepting_leads) : true,
            raw.travel_buffer_minutes !== undefined && raw.travel_buffer_minutes !== null ? Number(raw.travel_buffer_minutes) : 30
        );
    }
}
