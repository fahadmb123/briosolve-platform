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
