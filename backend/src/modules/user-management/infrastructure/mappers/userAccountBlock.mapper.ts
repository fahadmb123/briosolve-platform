import { Varchar } from "@prisma/orm-postgres/target/codec-types";
import type { Prisma } from "@prisma/client";
import { UserAccountBlock } from "../../domain/entities/userAccountBlock.entity";
import { CreateUserAccountBlockInput } from "../../domain/repositories/IUserAccountBlockRepository";

export type UserAccountBlockRecord = Prisma.UserAccountBlockGetPayload<{}>;

export class UserAccountBlockMapper {
    static toDomain(record: UserAccountBlockRecord): UserAccountBlock {
        const blockedAtRaw: any = record.blocked_at;
        const unblockedAtRaw: any = record.unblocked_at;
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new UserAccountBlock(
            record.id,
            record.user_id,
            record.blocked_by,
            record.reason,
            blockedAtRaw?.epochMilliseconds ? new Date(Number(blockedAtRaw.epochMilliseconds)) : new Date(blockedAtRaw),
            unblockedAtRaw ? (unblockedAtRaw?.epochMilliseconds ? new Date(Number(unblockedAtRaw.epochMilliseconds)) : new Date(unblockedAtRaw)) : null,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw)
        );
    }

    static toPersistence(data: CreateUserAccountBlockInput) {
        return {
            user_id: data.user_id,
            blocked_by: data.blocked_by,
            reason: data.reason as Varchar<1000>
        };
    }
}
