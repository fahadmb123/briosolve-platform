import type { Temporal } from "@js-temporal/polyfill";

export type response<T> = {
    success: boolean,
    message: string,
    data: T
}
export type User = {
    id:string;
    name: string;
    email: string;
    phone:string|null
    password_hash: string;
    role: "CUSTOMER" | "ADMIN" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    created_at: Temporal.Instant;
    updated_at: Temporal.Instant;
}


export type CustomerProfile = {
    id: string,
    user_id: string,
    current_address_id: string | null,
    profile_image: string | null,
    about: string,
    service_radius_km?: number | null,
    created_at: Temporal.Instant | string | Date,
    updated_at: Temporal.Instant | string | Date,
}

export type ProviderProfile = {
    id: string;
    user_id: string;
    business_name: string;
    experience: string;
    bio: string;
    profile_image: string | null;
    service_radius_km?: number | null;
    accepting_leads?: boolean;
    travel_buffer_minutes?: number;
    created_at: Temporal.Instant | string | Date;
    updated_at: Temporal.Instant | string | Date;
};

export type Weekday = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface ProviderAvailabilityItem {
    id: string;
    provider_id: string;
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface SetAvailabilitySlotPayload {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export type AvailabilityOverrideType = 'DAY_OFF' | 'CUSTOM_HOURS';

export interface ProviderAvailabilityOverrideItem {
    id: string;
    provider_id: string;
    override_date: string;
    type: AvailabilityOverrideType;
    start_time: string | null;
    end_time: string | null;
    reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateAvailabilityOverridePayload {
    override_date: string;
    type: AvailabilityOverrideType;
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
}

