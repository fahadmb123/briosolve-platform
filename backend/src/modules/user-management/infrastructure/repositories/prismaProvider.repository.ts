import { Temporal } from "@js-temporal/polyfill";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { IProviderRepository, CreateProviderInput } from "../../domain/repositories/IProviderRepository.js";
import { User } from "../../domain/entities/user.entity.js";
import { ProviderProfile } from "../../domain/entities/providerProfile.entity.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { ProviderProfileMapper, ProviderProfileRaw } from "../mappers/providerProfile.mapper.js";
import { UpdateProviderProfileInputDto } from "../../application/Dto/providerDto.js";

export class ProviderRepository implements IProviderRepository {
    async createProvider(data: CreateProviderInput): Promise<User> {
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

        for (const serviceId of data.services) {
            await db.orm.public.provider_services.create({
                provider_id: profile.id,
                service_id: serviceId as never
            } as never);
        }

        return UserMapper.toDomain(user);
    }

    async updateProfile(input: UpdateProviderProfileInputDto): Promise<void> {
        if (input.data.name !== undefined) {
            await db.orm.public.users
                .where({ id: input.id as Varchar<255> })
                .update({
                    name: input.data.name,
                    updated_at: Temporal.Now.instant()
                } as never);
        }

        const profile = await db.orm.public.provider_profiles
            .where({ user_id: input.id as Varchar<255> })
            .first();

        const businessName = input.data.business_name !== undefined ? input.data.business_name : input.data.businessName;

        if (profile) {
            await db.orm.public.provider_profiles
                .where({ user_id: input.id as Varchar<255> })
                .update({
                    business_name: businessName !== undefined ? businessName : profile.business_name,
                    experience: input.data.experience !== undefined ? input.data.experience : profile.experience,
                    bio: input.data.bio !== undefined ? input.data.bio : profile.bio,
                    profile_image: input.data.profile_image !== undefined ? input.data.profile_image : profile.profile_image,
                    service_radius_km: input.data.service_radius_km !== undefined ? input.data.service_radius_km : profile.service_radius_km,
                    updated_at: Temporal.Now.instant()
                } as never);
        } else {
            await db.orm.public.provider_profiles.create({
                user_id: input.id,
                business_name: businessName || "",
                experience: input.data.experience || "",
                bio: input.data.bio || "",
                profile_image: input.data.profile_image || null,
                service_radius_km: input.data.service_radius_km !== undefined ? input.data.service_radius_km : 20,
                created_at: Temporal.Now.instant(),
                updated_at: Temporal.Now.instant()
            } as never);
        }
        return;
    }

    async findById(id: string): Promise<ProviderProfile | null> {
        const provider = await db.orm.public.provider_profiles
            .where({ user_id: id as Varchar<255> })
            .first();

        if (!provider) return null;
        return ProviderProfileMapper.toDomain(provider as ProviderProfileRaw);
    }

    async findProfileByUserId(userId: string): Promise<ProviderProfile | null> {
        return this.findById(userId);
    }
}
