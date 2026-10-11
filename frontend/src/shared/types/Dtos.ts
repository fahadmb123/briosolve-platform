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
    created_at: Temporal.Instant,
    updated_at: Temporal.Instant,
}

export type ProviderProfile = {
    id: string;
    user_id: string;
    business_name: string;
    experience: string;
    bio: string;
    profile_image: string | null;
    created_at: Temporal.Instant | string | Date;
    updated_at: Temporal.Instant | string | Date;
};

