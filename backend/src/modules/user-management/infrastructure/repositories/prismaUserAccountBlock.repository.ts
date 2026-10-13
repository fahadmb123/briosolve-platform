import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { UserAccountBlock } from "../../domain/entities/userAccountBlock.entity.js";
import { IUserAccountBlockRepository, CreateUserAccountBlockInput } from "../../domain/repositories/IUserAccountBlockRepository.js";
import { UserAccountBlockMapper } from "../mappers/userAccountBlock.mapper.js";

export class UserAccountBlockRepository implements IUserAccountBlockRepository {
    async create(data: CreateUserAccountBlockInput): Promise<UserAccountBlock> {
        const created = await db.orm.public.user_account_blocks.create({
            user_id: data.user_id,
            blocked_by: data.blocked_by,
            reason: data.reason as Varchar<1000>
        } as never);

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

    async updateUnblockedAt(userId: string): Promise<void> {
        await db.orm.public.user_account_blocks.where({ user_id: userId }).update({
            unblocked_at: Temporal.Now.instant()
        } as never);
    }
}
