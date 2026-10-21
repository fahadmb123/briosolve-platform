import { Address } from "../../../../domain/entities/address.entity";
import { CustomerProfile } from "../../../../domain/entities/customerProfile.entity";
import { ProviderProfile } from "../../../../domain/entities/providerProfile.entity";

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
    customer_profile?: CustomerProfile | null;
    provider_profile?: ProviderProfile | null;
    distance?: number;
}