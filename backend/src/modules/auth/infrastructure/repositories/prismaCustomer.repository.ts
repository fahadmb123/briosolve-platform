import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../shared/infrastructure/persistence/prisma/client"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity"
import { ICustomerRepository } from "../../domain/repositories/customer.respository";
import { User } from "../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import { CustomerProfileMapper } from "../mappers/customerProfile.mapper";
import { RegisterCustomerInput } from "../../application/dtos/request/register-customer.dto";



export class PrismaCustomerRepository implements ICustomerRepository {

    async createCustomer(data: RegisterCustomerInput): Promise<User> {
        return await db.transaction(async (tx) => {
            const user = await tx.orm.public.users.create({
                name: data.name,
                email: data.email,
                password_hash: data.password,
                role: "CUSTOMER" as const,
                status: "ACTIVE" as const,
                email_verified: true,
                phone_verified: false,
            } as never)

            await tx.orm.public.customer_profiles.create({
                user_id: user.id, 
                about: "",
                service_radius_km: 20,
            } as never)

            return UserMapper.toDomain(user)
        })
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles
            .where({user_id:id as Varchar<255>})
            .first()
        
        if (!customer) return null
        
        return CustomerProfileMapper.toDomain(customer)
    }
}