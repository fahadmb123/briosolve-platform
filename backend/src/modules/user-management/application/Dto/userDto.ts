import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"
import { ProviderProfile } from "../../domain/entities/providerProfile.entity.js"
import { User } from "../../domain/entities/user.entity.js"


import { Address } from "../../domain/entities/address.entity.js"

export type UpdateUserStatusDto = {
    id:string,
    status:string
}

export type GetProfileUseCaseOutputDto = {
    user:User,
    profile:CustomerProfile | ProviderProfile | null
}
export type GetProfileUseCaseInputDto = {
    id:string,
    role:string
}

export type UpdateCustomerProfileInputDto = {
    id:string,
    data:UpdateCustomerProfileInputDataDto
}
export type UpdateCustomerProfileInputDataDto = {
    name?:string,
    about?:string,
    profile_image?:string
}

export type UserResponseDto = {
    id:string;
    name: string;
    email: string;
    phone:string|null;
    role: "CUSTOMER" | "ADMIN" | "INVESTIGATOR" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    current_address_id: string | Address | null;
    created_at: Date;
    updated_at: Date;
}

export type CustomerProfileResponseDto = {
    id: string;
    user_id: string;
    current_address_id: string | null;
    profile_image: string | null;
    about: string;
    created_at: Date;
    updated_at: Date;
}



export interface UpdateUserRepositoryInput {
    name?: string;
    email?: string;
    phone?: string | null;
    role?: string;
    status?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    current_address_id?: string | null;
}