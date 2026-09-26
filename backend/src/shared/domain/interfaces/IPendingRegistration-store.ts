export interface IPendingCustomerRegistration {
    name: string;
    email: string;
    passwordHash: string;
    otpHash: string;
    attempts: number;
    for:string
}

export interface IPendingRegistrationStore {
    save(
        registrationId: string,
        data: IPendingCustomerRegistration,
        ttlSeconds: number
    ): Promise<void>

    get(registrationId: string): Promise<IPendingCustomerRegistration | null>
    delete(registrationId: string): Promise<void>
    getTtl(registrationId: string): Promise<number>
}