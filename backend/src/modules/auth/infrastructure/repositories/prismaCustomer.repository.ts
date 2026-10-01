import { Varchar } from "@prisma/orm-postgres/target/codec-types"
import { db } from "../../../../infrastructure/persistence/prisma/client.js"
import { UpdateCustomerProfileInputDto } from "../../application/dto/authDto.js"
import { User } from "../../domain/entities/user.entity.js"
import { ICustomerRepository } from "../../domain/repositories/customer.respository.js"
import { RegisterCustomerInput } from "../../domain/repositories/user.repository.js"
import { CustomerProfile } from "../../domain/entities/customerProfile.entity.js"



export class PrismaCustomerRepository implements ICustomerRepository {
    async createCustomer(data: RegisterCustomerInput): Promise<User> {
        const user = await db.orm.public.users.create({
            name: data.name,
            email: data.email,
            password_hash: data.password,
            role: "CUSTOMER" as const,
            status: "ACTIVE" as const,
            email_verified: false,
            phone_verified: false,
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant(),
        } as never)

        await db.orm.public.customer_profiles.create({
            user_id: user.id, 
            created_at: Temporal.Now.instant(),
            updated_at: Temporal.Now.instant(),
        } as never)

        const userEntity = new User(
            user.id,
            user.name,
            user.email,
            user.phone,
            user.role,
            user.status,
            user.email_verified,
            user.phone_verified,
            new Date(user.created_at.epochMilliseconds),
            new Date(user.updated_at.epochMilliseconds)
        )

        return userEntity
    }

    async updateProfile(input:UpdateCustomerProfileInputDto): Promise<void> {
        await db.orm.public.users
            .where({ id: input.id as Varchar<255> })
            .update({name: input.data.name} as never);

        await db.orm.public.customer_profiles
            .where({ user_id: input.id as Varchar<255> })
            .update({about: input.data.about} as never);
        return
    }

    async findById(id : string): Promise<CustomerProfile | null> {
        const customer = await db.orm.public.customer_profiles.where({user_id:id as Varchar<255>}).first()
        return customer ? (customer as CustomerProfile)  : null
    }
}