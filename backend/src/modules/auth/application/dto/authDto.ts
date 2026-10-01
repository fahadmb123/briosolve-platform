import { Temporal } from "@js-temporal/polyfill";
import { User } from "../../domain/entities/user.entity.js";
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js";

export type LoginInputDto = {
    email:string,
    password:string
}

export type UserData = {
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


export type UpdateCustomerProfileInputDto = {
    id:string,
    data:UpdateCustomerProfileInputDataDto
}

export type UpdateCustomerProfileInputDataDto = {
    name:string,
    about:string
}





export type GetProfileUseCaseOutputDto = {
    user:User,
    profile:CustomerProfile | null
}
export type GetProfileUseCaseInputDto = {
    id:string,
    role:string
}
