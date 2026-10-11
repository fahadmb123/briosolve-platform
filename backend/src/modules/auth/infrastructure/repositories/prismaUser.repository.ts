import { Temporal } from "@js-temporal/polyfill";
import { User } from "../../domain/entities/user.entity.js";
import { IUserRepository } from "../../domain/repositories/user.repository.js";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { UserMapper } from "../mappers/user.mapper.js";

type userPartial = Partial<User>;

export class PrismaUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const user = await db.orm.public.users
            .where({ email: email as Varchar<255> })
            .include("current_address")
            .include("customer_profile")
            .include("provider_profile")
            .first();
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async findById(id: string): Promise<User | null> {
        const user = await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .include("current_address")
            .include("customer_profile")
            .include("provider_profile")
            .first();
        if (!user) return null;
        return UserMapper.toDomain(user);
    }

    async findByPhone(phone: string): Promise<User | null> {
        const response = await db.orm.public.users
            .where({ phone: phone as Varchar<20> })
            .include("current_address")
            .include("customer_profile")
            .include("provider_profile")
            .first();
        if (!response) return null;

        return UserMapper.toDomain(response);
    }

    async updatePassword(id: string, passwordHash: string): Promise<void> {
        await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .update({
                password_hash: passwordHash,
                updated_at: Temporal.Now.instant(),
            } as never);
        return;
    }

    async update(id: string, data: userPartial): Promise<void> {
        const updateData: any = { 
            ...data, 
            updated_at: Temporal.Now.instant() 
        };
        if (data.email !== undefined) {
            updateData.email = data.email;
            updateData.email_verified = true;
        }
        if (data.phone !== undefined) {
            updateData.phone = data.phone;
            updateData.phone_verified = !!data.phone;
        }

        await db.orm.public.users
            .where({ id: id as Varchar<255> })
            .update(updateData as never);
    }
}