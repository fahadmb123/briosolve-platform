export interface IPendingCustomerRegistration {
    name: string;
    email: string;
    phone?:string
    businessName?: string;
    passwordHash?: string;
    otpHash: string;
    attempts: number;
    path:string,
    otpExpiresAt?: number;
    for:string;
    userId?: string;
}

export interface IPendingRegistrationStore {
    save(
        registrationId: string,
        data: IPendingCustomerRegistration,
        ttlSeconds: number
    ): Promise<void>

    update(registrationId: string, data: IPendingCustomerRegistration): Promise<void>

    get(registrationId: string): Promise<IPendingCustomerRegistration | null>
    delete(registrationId: string): Promise<void>
    getTtl(registrationId: string): Promise<number>
}