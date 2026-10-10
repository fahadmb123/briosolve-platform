import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { IProviderRepository, CreateProviderInput } from "../../domain/repositories/IProviderRepository.js";
import { User } from "../../domain/entities/user.entity.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";

export class PrismaProviderRepository implements IProviderRepository {
    async createProvider(data: CreateProviderInput): Promise<User> {
        // Run as transaction if needed, but for now we'll do sequential creates
        const user = await db.orm.public.users.create({
            name: data.name,
            email: data.email,
            password_hash: data.password,
            role: "PROVIDER" as const,
            status: "ACTIVE" as const,
            email_verified: true,
            phone_verified: false,
        } as never);

        const profile = await db.orm.public.provider_profiles.create({
            user_id: user.id,
            business_name: data.businessName,
            experience: data.experience,
            bio: data.bio,
            profile_image: null
        } as never);

        // Add services
        for (const serviceId of data.services) {
            await db.orm.public.provider_services.create({
                provider_id: profile.id,
                service_id: serviceId as never
            } as never);
        }

        return UserMapper.toDomain(user);
    }

    async update(id: string, data: Partial<User>): Promise<void> {
        // Implement if needed
    }

    async delete(id: string): Promise<void> {
        // Implement if needed
    }

    async findById(id: string): Promise<User | null> {
        const user = await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .first();
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async findAll(): Promise<User[]> {
        return [];
    }
}
