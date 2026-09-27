import { Temporal } from "@js-temporal/polyfill";
import { Customer } from "../../domain/entities/customer.entity.js";
import {ICustomerRepository,RegisterCustomerInput} from "../../domain/repositories/customer.repository.js";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { UserData } from "../../application/dto/authDto.js";


export class PrismaCustomerRepository implements ICustomerRepository {

    async findByEmail(email: string): Promise<Customer | null> {
        const user = await db.orm.public.users.where({email:email as Varchar<255>}).first()
        return user ? (user as unknown as Customer) : null
    }

    async createCustomer(data: RegisterCustomerInput): Promise<Customer> {
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

        const customer = new Customer(
            user.id,
            user.name,
            user.email,
            user.phone,
            user.role
        )

        return customer
    }

    async findById(id: string): Promise<UserData | null> {
        const user = await db.orm.public.users.where({id:id as Varchar<255>}).first()
        return user ? (user as UserData)  : null
    }
    async updatePassword(id: string, passwordHash: string): Promise<void> {
        await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .update({
                password_hash: passwordHash,
                updated_at: Temporal.Now.instant(),
            } as never);
        return
    }
}