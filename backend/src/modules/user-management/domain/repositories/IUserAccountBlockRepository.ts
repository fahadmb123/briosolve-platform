import { UserAccountBlock } from "../entities/userAccountBlock.entity";

export type CreateUserAccountBlockInput = {
    user_id: string;
    blocked_by: string;
    reason: string;
};

export interface IUserAccountBlockRepository {
    create(data: CreateUserAccountBlockInput): Promise<UserAccountBlock>;
    findByUserId(userId: string): Promise<UserAccountBlock | null>;
    deleteByUserId(userId: string): Promise<void>;
    updateUnblockedAt(userId: string, unblockedAt?: Date): Promise<void>;
}
