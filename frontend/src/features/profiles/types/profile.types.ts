import type { Temporal } from "@js-temporal/polyfill";
import type { Address } from "../../addresses/types/address";
import type { response } from "../../../shared/types/Dtos";

export type { response };

export type CustomerProfile = {
    id: string;
    user_id: string;
    current_address_id: string | null;
    profile_image: string | null;
    about: string;
    service_radius_km?: number | null;
    created_at: Temporal.Instant | string | Date;
    updated_at: Temporal.Instant | string | Date;
};

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
    completed_jobs?: number;
    kyc_status?: 'NOT_SUBMITTED' | 'PENDING' | 'APPROVED' | 'REJECTED';
    skills?: string | null;
    created_at: Temporal.Instant | string | Date;
    updated_at: Temporal.Instant | string | Date;
};

export interface PopulatedProviderService {
    id: string;
    provider_id: string;
    service_id: string;
    created_at: string;
    service?: {
        id: string;
        category_id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        created_at: string;
        updated_at: string;
        category?: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            created_at: string;
            updated_at: string;
        };
    };
};

export type User = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    password_hash?: string;
    role: "CUSTOMER" | "ADMIN" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    current_address_id?: string | Address | null;
    created_at: Temporal.Instant | string | Date;
    updated_at: Temporal.Instant | string | Date;
    customer_profile?: CustomerProfile | null;
    provider_profile?: ProviderProfile | null;
    distance?: number;
};
