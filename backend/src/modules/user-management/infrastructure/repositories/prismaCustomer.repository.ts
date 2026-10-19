import { Temporal } from "@js-temporal/polyfill";
import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../shared/infrastructure/persistence/prisma/client"
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto"
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity"
import { CustomerProfileMapper } from "../mappers/customerProfile.mapper"



export class CustomerRepository implements ICustomerRepository {
    async updateProfile(input:UpdateCustomerProfileInputDto): Promise<void> {
        return await db.transaction(async (tx) => {
            if (input.data.name !== undefined) {
                await tx.orm.public.users
                    .where({ id: input.id as Varchar<255> })
                    .update({
                        name: input.data.name,
                        updated_at: Temporal.Now.instant()
                    } as never);
            }

            const profile = await tx.orm.public.customer_profiles
                .where({ user_id: input.id as Varchar<255> })
                .first();

            if (profile) {
                await tx.orm.public.customer_profiles
                    .where({ user_id: input.id as Varchar<255> })
                    .update({
                        about: input.data.about !== undefined ? input.data.about : profile.about,
                        profile_image: input.data.profile_image !== undefined ? input.data.profile_image : profile.profile_image,
                        service_radius_km: input.data.service_radius_km !== undefined ? input.data.service_radius_km : profile.service_radius_km,
                        updated_at: Temporal.Now.instant()
                    } as never);
            } else {
                await tx.orm.public.customer_profiles.create({
                    user_id: input.id,
                    about: input.data.about || "",
                    profile_image: input.data.profile_image || null,
                    service_radius_km: input.data.service_radius_km ?? 20,
                    created_at: Temporal.Now.instant(),
                    updated_at: Temporal.Now.instant()
                } as never);
            }
        });
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles
            .where({user_id:id as Varchar<255>})
            .first()
        
        if (!customer) return null
        return CustomerProfileMapper.toDomain(customer)
    }

    async deleteByUserId(userId: string): Promise<void> {
        await db.orm.public.customer_profiles
            .where({ user_id: userId as Varchar<255> })
            .delete();
    }
}