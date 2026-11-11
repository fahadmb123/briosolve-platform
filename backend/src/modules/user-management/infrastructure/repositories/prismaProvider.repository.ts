import { Temporal } from "@js-temporal/polyfill";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/database/client";
import { IProviderRepository, CreateProviderInput, CreateProviderProfileInput } from "../../domain/repositories/IProviderRepository";
import { User } from "../../domain/entities/user.entity";
import { ProviderProfile } from "../../domain/entities/providerProfile.entity";
import { UserMapper } from "../mappers/user.mapper";
import { ProviderProfileMapper, ProviderProfileRaw } from "../mappers/providerProfile.mapper";
import { UpdateProviderProfileInputDto } from "../../application/dtos/request/provider/update-provider-profile.dto";

export class ProviderRepository implements IProviderRepository {
    async createProvider(data: CreateProviderInput): Promise<User> {
        return await db.transaction(async (tx) => {
            const user = await tx.orm.public.users.create(
                UserMapper.toPersistence(data, "PROVIDER") as never
            );

            const profile = await tx.orm.public.provider_profiles.create(
                ProviderProfileMapper.toPersistence(user.id, data) as never
            );

            for (const serviceId of data.services) {
                await tx.orm.public.provider_services.create(
                    ProviderProfileMapper.toPersistenceService(profile.id, serviceId) as never
                );
            }

            return UserMapper.toDomain(user);
        });
    }

    async createProviderProfile(data: CreateProviderProfileInput): Promise<{ id: string }> {
        return await db.transaction(async (tx) => {
            const profile = await tx.orm.public.provider_profiles.create(
                ProviderProfileMapper.toPersistence(data.userId, data) as never
            );

            for (const serviceId of data.services) {
                await tx.orm.public.provider_services.create(
                    ProviderProfileMapper.toPersistenceService(profile.id, serviceId) as never
                );
            }

            return { id: profile.id };
        });
    }

    async updateProfile(input: UpdateProviderProfileInputDto): Promise<void> {
        return await db.transaction(async (tx) => {
            if (input.data.name !== undefined) {
                await tx.orm.public.users
                    .where({ id: input.id as Varchar<255> })
                    .update({
                        name: input.data.name,
                        updated_at: Temporal.Now.instant()
                    } as never);
            }

            const profile = await tx.orm.public.provider_profiles
                .where({ user_id: input.id as Varchar<255> })
                .first();

            const businessName = input.data.business_name !== undefined ? input.data.business_name : input.data.businessName;

            if (profile) {
                await tx.orm.public.provider_profiles
                    .where({ user_id: input.id as Varchar<255> })
                    .update({
                        business_name: businessName !== undefined ? businessName : profile.business_name,
                        experience: input.data.experience !== undefined ? input.data.experience : profile.experience,
                        bio: input.data.bio !== undefined ? input.data.bio : profile.bio,
                        profile_image: input.data.profile_image !== undefined ? input.data.profile_image : profile.profile_image,
                        service_radius_km: input.data.service_radius_km !== undefined ? input.data.service_radius_km : profile.service_radius_km,
                        accepting_leads: input.data.accepting_leads !== undefined ? input.data.accepting_leads : profile.accepting_leads,
                        travel_buffer_minutes: input.data.travel_buffer_minutes !== undefined ? input.data.travel_buffer_minutes : profile.travel_buffer_minutes,
                        updated_at: Temporal.Now.instant()
                    } as never);
            } else {
                await tx.orm.public.provider_profiles.create(
                    ProviderProfileMapper.toPersistence(input.id, input.data) as never
                );
            }
        });
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

    async deleteByUserId(userId: string): Promise<void> {
        await db.orm.public.provider_profiles
            .where({ user_id: userId as Varchar<255> })
            .delete();
    }
}
