export interface PendingCustomerRegistration {
    name: string;
    email: string;
    passwordHash: string;
    otpHash: string;
    attempts: number;
}

export interface PendingRegistrationStore {
    save(
        registrationId: string,
        data: PendingCustomerRegistration,
        ttlSeconds: number
    ): Promise<void>

    get(registrationId: string): Promise<PendingCustomerRegistration | null>
    delete(registrationId: string): Promise<void>
}