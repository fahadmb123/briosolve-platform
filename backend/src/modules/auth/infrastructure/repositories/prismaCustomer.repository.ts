import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../infrastructure/persistence/prisma/client.js"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"
import { ICustomerRepository } from "../../domain/repositories/customer.respository.js";
import { User } from "../../domain/entities/user.entity.js";
import { RegisterCustomerInput } from "../../domain/repositories/user.repository.js";
import { UserMapper } from "../mappers/user.mapper.js";
import { CustomerProfileMapper } from "../mappers/customerProfile.mapper.js";



export class PrismaCustomerRepository implements ICustomerRepository {

    async createCustomer(data: RegisterCustomerInput): Promise<User> {
        const user = await db.orm.public.users.create({
            name: data.name,
            email: data.email,
            password_hash: data.password,
            role: "CUSTOMER" as const,
            status: "ACTIVE" as const,
            email_verified: true,
            phone_verified: false,
        } as never)

        await db.orm.public.customer_profiles.create({
            user_id: user.id, 
            about: "",
        } as never)

        return UserMapper.toDomain(user)
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles
            .where({user_id:id as Varchar<255>})
            .first()
        
        if (!customer) return null
        
        return CustomerProfileMapper.toDomain(customer)
    }
}