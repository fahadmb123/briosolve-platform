import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { User } from "../entities/user.entity.js";

export type CreateProviderInput = {
    name: string;
    email: string;
    password: string;
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export interface IProviderRepository extends BaseRepository<User | null> {
    createProvider(data: CreateProviderInput): Promise<User>;
}
