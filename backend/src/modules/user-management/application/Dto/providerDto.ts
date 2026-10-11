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
    created_at: Date | { epochMilliseconds: number } | string;
    updated_at: Date | { epochMilliseconds: number } | string;
}