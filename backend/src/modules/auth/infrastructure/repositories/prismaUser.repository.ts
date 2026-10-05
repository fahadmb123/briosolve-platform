import { Temporal } from "@js-temporal/polyfill";
import { User } from "../../domain/entities/user.entity.js";
import {IUserRepository} from "../../domain/repositories/user.repository.js";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { UserData } from "../../application/dto/authDto.js";


export class PrismaUserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const user = await db.orm.public.users.where({email:email as Varchar<255>}).first()
        return user ? (user as unknown as User) : null
    }


    async findById(id: string): Promise<UserData | null> {
        const user = await db.orm.public.users.where({id:id as Varchar<255>}).first()
        return user ? (user as UserData)  : null
    }
    
    async findByPhone(phone: string): Promise<User | null> {
        const response = await db.orm.public.users.where({phone:phone as Varchar<20>}).first()
        if (!response) return null
        const user = new User(
            response.id,
            response.name,
            response.email,
            response.phone,
            response.role,
            response.status,
            response.email_verified,
            response.phone_verified,
            response.created_at,
            response.updated_at
        )
        return user
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

    async update(id: string, data: { email?: string, phone?: string }): Promise<void> {
        const updateData: any = { updated_at: Temporal.Now.instant() }
        if (data.email) {
            updateData.email = data.email
            updateData.email_verified = true
        }
        if (data.phone) {
            updateData.phone = data.phone
            updateData.phone_verified = true
        }

        await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .update(updateData as never)
    }
}