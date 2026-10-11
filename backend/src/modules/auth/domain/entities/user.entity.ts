import { Address } from "../../../user-management/domain/entities/address.entity.js";
import { CustomerProfile } from "./customerProfile.entity.js";
import { ProviderProfile } from "./providerProfile.entity.js";

export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string | null,
        public readonly passwordHash: string,
        public readonly role: string,
        public readonly status: string,
        public readonly email_verified: boolean,
        public readonly phone_verified: boolean,
        public readonly current_address_id: string | Address | null,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly customer_profile?: CustomerProfile | null,
        public readonly provider_profile?: ProviderProfile | null
    ) {}
}
