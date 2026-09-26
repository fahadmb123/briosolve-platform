import { Temporal } from "@js-temporal/polyfill";

export type LoginInputDto = {
    email:string,
    password:string
}

export type UserData = {
    id:string;
    name: string;
    email: string;
    password_hash: string;
    role: "CUSTOMER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    created_at: Temporal.Instant;
    updated_at: Temporal.Instant;
}