import { RefreshSession } from "../entities/refreshSession.entity";

export interface IRefreshSessionRepository {
    create(session: RefreshSession): Promise<RefreshSession>;
    findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
    revokeByTokenHash(tokenHash: string, revokedAt?: Date): Promise<void>;
    revokeAllByFamilyId(familyId: string, revokedAt?: Date): Promise<void>;
    revokeAllByUserId(userId: string, revokedAt?: Date): Promise<void>;
    rotateSession(oldTokenHash: string, newSession: RefreshSession): Promise<RefreshSession | null>;
}
