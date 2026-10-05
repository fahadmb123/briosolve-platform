import { Temporal } from "@js-temporal/polyfill";
import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../infrastructure/persistence/prisma/client.js"
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto.js"
import { ICustomerRepository } from "../../domain/repositories/ICustomerRespository.js"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"



export class CustomerRepository implements ICustomerRepository {
    async updateProfile(input:UpdateCustomerProfileInputDto): Promise<void> {
        await db.orm.public.users
            .where({ id: input.id as Varchar<255> })
            .update({
                name: input.data.name,
                updated_at: Temporal.Now.instant()
            } as never);

        const profile = await db.orm.public.customer_profiles
            .where({ user_id: input.id as Varchar<255> })
            .first();

        if (profile) {
            await db.orm.public.customer_profiles
                .where({ user_id: input.id as Varchar<255> })
                .update({
                    about: input.data.about !== undefined ? input.data.about : profile.about,
                    updated_at: Temporal.Now.instant()
                } as never);
        } else {
            await db.orm.public.customer_profiles.create({
                user_id: input.id,
                about: input.data.about || "",
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
        return new CustomerProfile(
            customer.id,
            customer.user_id,
            customer.current_address_id,
            customer.profile_image,
            customer.about,
            customer.created_at,
            customer.updated_at
        )
    }
}