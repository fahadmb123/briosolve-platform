import { Temporal } from "@js-temporal/polyfill";
import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../infrastructure/persistence/prisma/client.js"
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto.js"
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"
import { CustomerProfileMapper } from "../mappers/customerProfile.mapper.js"



export class CustomerRepository implements ICustomerRepository {
    async updateProfile(input:UpdateCustomerProfileInputDto): Promise<void> {
        if (input.data.name !== undefined) {
            await db.orm.public.users
                .where({ id: input.id as Varchar<255> })
                .update({
                    name: input.data.name,
                    updated_at: Temporal.Now.instant()
                } as never);
        }

        const profile = await db.orm.public.customer_profiles
            .where({ user_id: input.id as Varchar<255> })
            .first();

        if (profile) {
            await db.orm.public.customer_profiles
                .where({ user_id: input.id as Varchar<255> })
                .update({
                    about: input.data.about !== undefined ? input.data.about : profile.about,
                    profile_image: input.data.profile_image !== undefined ? input.data.profile_image : profile.profile_image,
                    updated_at: Temporal.Now.instant()
                } as never);
        } else {
            await db.orm.public.customer_profiles.create({
                user_id: input.id,
                about: input.data.about || "",
                profile_image: input.data.profile_image || null,
                created_at: Temporal.Now.instant(),
                updated_at: Temporal.Now.instant()
            } as never);
        }
        return
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles
            .where({user_id:id as Varchar<255>})
            .first()
        
        if (!customer) return null
        return CustomerProfileMapper.toDomain(customer)
    }
}