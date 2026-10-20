import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { UserAccountBlock } from "../../domain/entities/userAccountBlock.entity";
import { IUserAccountBlockRepository, CreateUserAccountBlockInput } from "../../domain/repositories/IUserAccountBlockRepository";
import { UserAccountBlockMapper } from "../mappers/userAccountBlock.mapper";

export class UserAccountBlockRepository implements IUserAccountBlockRepository {
    async create(data: CreateUserAccountBlockInput): Promise<UserAccountBlock> {
        const created = await db.orm.public.user_account_blocks.create(
            UserAccountBlockMapper.toPersistence(data) as never
        );

        return UserAccountBlockMapper.toDomain(created);
    }

    async findByUserId(userId: string): Promise<UserAccountBlock | null> {
        const record = await db.orm.public.user_account_blocks.where({ user_id: userId }).first();
        if (!record) return null;
        return UserAccountBlockMapper.toDomain(record);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await db.orm.public.user_account_blocks.where({ user_id: userId }).delete();
    }

    async updateUnblockedAt(userId: string, unblockedAt: Date): Promise<void> {
        await db.orm.public.user_account_blocks.where({ user_id: userId }).update({
            unblocked_at: Temporal.Instant.from(unblockedAt.toISOString())
        } as never);
    }
}
