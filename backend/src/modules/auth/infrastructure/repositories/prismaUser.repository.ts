import { Temporal } from "@js-temporal/polyfill";
import { User } from "../../domain/entities/user.entity.js";
import {IUserRepository,RegisterCustomerInput} from "../../domain/repositories/user.repository.js";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { UserData } from "../../application/dto/authDto.js";


export class PrismaUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const user = await db.orm.public.users.where({email:email as Varchar<255>}).first()
        return user ? (user as unknown as User) : null
    }

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

    async update(id: string,data:unknown): Promise<void> {
        await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .update(data as never);
        return
    }
}