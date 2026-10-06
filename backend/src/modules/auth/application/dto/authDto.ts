import { Temporal } from "@js-temporal/polyfill";

export type LoginInputDto = {
    email:string,
    password:string
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
    created_at: Date;
    updated_at: Date;
}

export type AuthResponseDto = {
    accessToken: string;
    user: UserResponseDto;
}



export type SendSmsOtpUseCaseInputDto = {
    phone:string,
    path:string;
    id:string
}
export type SendSmsOtpUseCaseOutputDto = {
    expiresIn:number,
    registrationId:string
}
