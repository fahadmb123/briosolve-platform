import { Weekday } from "../../domain/entities/providerAvailability.entity.js";

export type EmailVerificationUseCaseOutputDto = {
    expiresIn: number;
    registrationId: string;
};

export type RegisterProviderInput = {
    fullName: string;
    email: string;
    password: string;
    businessName: string;
};

export type UpdateProviderProfileInputDataDto = {
    name?: string;
    businessName?: string;
    business_name?: string;
    experience?: string;
    bio?: string;
    profile_image?: string | null;
    service_radius_km?: number | null;
    accepting_leads?: boolean;
    travel_buffer_minutes?: number;
};

export type UpdateProviderProfileInputDto = {
    id: string;
    data: UpdateProviderProfileInputDataDto;
};

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

export interface AvailabilitySlotDto {
    day_of_week: Weekday;
    start_time: string;
    end_time: string;
}

export interface SetProviderAvailabilityInputDto {
    userId: string;
    slots: AvailabilitySlotDto[];
}

export interface GetProviderAvailabilityInputDto {
    userId: string;
}

export interface CreateAvailabilityOverrideInputDto {
    userId: string;
    override_date: string;
    type: "DAY_OFF" | "CUSTOM_HOURS";
    start_time?: string | null;
    end_time?: string | null;
    reason?: string | null;
}

export interface GetAvailabilityOverridesInputDto {
    userId: string;
}

export interface DeleteAvailabilityOverrideInputDto {
    userId: string;
    overrideId: string;
}