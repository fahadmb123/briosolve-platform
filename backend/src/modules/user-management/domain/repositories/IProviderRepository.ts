import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { User } from "../entities/user.entity.js";
import { ProviderProfile } from "../entities/providerProfile.entity.js";
import { UpdateProviderProfileInputDto } from "../../application/Dto/providerDto.js";

export type CreateProviderInput = {
    name: string;
    email: string;
    password: string;
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export interface IProviderRepository extends BaseRepository<ProviderProfile | null> {
    createProvider(data: CreateProviderInput): Promise<User>;
    updateProfile(data: UpdateProviderProfileInputDto): Promise<void>;
    findById(id: string): Promise<ProviderProfile | null>;
    findProfileByUserId?(userId: string): Promise<ProviderProfile | null>;
}
