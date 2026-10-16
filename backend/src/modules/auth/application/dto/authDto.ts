import { Address } from "../../../user-management/domain/entities/address.entity";
import { CustomerProfile } from "../../domain/entities/customerProfile.entity";
import { ProviderProfile } from "../../domain/entities/providerProfile.entity";
import { User } from "../../domain/entities/user.entity";

export type LoginInputDto = {
    email: string;
    password: string;
    userAgent?: string | null;
    ipAddress?: string | null;
};

export type LoginOutputDto = {
    accessToken: string;
    refreshToken: string;
    isExist: User;
};

export type RefreshTokenInputDto = {
    refreshToken: string;
    userAgent?: string | null;
    ipAddress?: string | null;
};

export type RefreshTokenOutputDto = {
    accessToken: string;
    refreshToken: string;
};

export type LogoutInputDto = {
    refreshToken?: string | null;
};

export type UserResponseDto = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: "CUSTOMER" | "ADMIN" | "INVESTIGATOR" | "PROVIDER";
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
    email_verified: boolean;
    phone_verified: boolean;
    current_address_id: string | Address | null;
    created_at: Date;
    updated_at: Date;
    customer_profile?: CustomerProfile | null;
    provider_profile?: ProviderProfile | null;
};

export type AuthResponseDto = {
    accessToken: string;
    user: UserResponseDto;
};

export type SendSmsOtpUseCaseInputDto = {
    phone: string;
    path: string;
    id: string;
};

export type SendSmsOtpUseCaseOutputDto = {
    expiresIn: number;
    registrationId: string;
};
