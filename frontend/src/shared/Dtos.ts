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
    role: "CUSTOMER" | "ADMIN" | "INVESTIGATOR" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    created_at: Temporal.Instant;
    updated_at: Temporal.Instant;
}