import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { User } from "../entities/user.entity";
import { ProviderProfile } from "../entities/providerProfile.entity";
import { UpdateProviderProfileInputDto } from "../../application/dtos/request/provider/update-provider-profile.dto";


export type CreateProviderInput = {
    name: string;
    email: string;
    password: string;
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export type CreateProviderProfileInput = {
    userId: string;
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export interface IProviderRepository extends BaseRepository<ProviderProfile | null> {
    createProvider(data: CreateProviderInput): Promise<User>;
    createProviderProfile(data: CreateProviderProfileInput): Promise<{ id: string }>;
    updateProfile(data: UpdateProviderProfileInputDto): Promise<void>;
    findProfileByUserId(userId: string): Promise<ProviderProfile | null>;
    deleteByUserId(userId: string): Promise<void>;
}
