import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../infrastructure/persistence/prisma/client.js"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"
import { ICustomerRepository } from "../../domain/repositories/customer.respository.js";



export class PrismaCustomerRepository implements ICustomerRepository {

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