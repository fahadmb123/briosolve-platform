import { Weekday } from "../../domain/entities/providerAvailability.entity";


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
    completed_jobs?: number;
    kyc_status?: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
    skills?: string | null;
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
}