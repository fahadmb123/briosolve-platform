import { Temporal } from "@js-temporal/polyfill";
import { RefreshSession } from "../../domain/entities/refreshSession.entity";
import { IRefreshSessionRepository } from "../../domain/repositories/refreshSession.repository";
import { db } from "../../../../shared/infrastructure/persistence/prisma/client";
import { RefreshSessionMapper, RefreshSessionRaw } from "../mappers/refreshSession.mapper";

export class PrismaRefreshSessionRepository implements IRefreshSessionRepository {
    async create(session: RefreshSession): Promise<RefreshSession> {
        const raw = await db.orm.public.refresh_sessions.create(
            RefreshSessionMapper.toPersistence(session) as never
        );

        return RefreshSessionMapper.toDomain(raw as RefreshSessionRaw);
    }

    async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
        const raw = await db.orm.public.refresh_sessions
            .where({ token_hash: tokenHash as never })
            .first();

        if (!raw) return null;
        return RefreshSessionMapper.toDomain(raw as RefreshSessionRaw);
    }

    async revokeByTokenHash(tokenHash: string, revokedAt: Date = new Date()): Promise<void> {
        await db.orm.public.refresh_sessions
            .where({ token_hash: tokenHash as never })
            .update({
                revoked_at: Temporal.Instant.from(revokedAt.toISOString()),
                updated_at: Temporal.Now.instant()
            } as never);
    }

    async revokeAllByFamilyId(familyId: string, revokedAt: Date = new Date()): Promise<void> {
        await db.orm.public.refresh_sessions
            .where({ family_id: familyId as never })
            .updateAll({
                revoked_at: Temporal.Instant.from(revokedAt.toISOString()),
                updated_at: Temporal.Now.instant()
            } as never);
    }

    async revokeAllByUserId(userId: string, revokedAt: Date = new Date()): Promise<void> {
        await db.orm.public.refresh_sessions
            .where({ user_id: userId as never })
            .updateAll({
                revoked_at: Temporal.Instant.from(revokedAt.toISOString()),
                updated_at: Temporal.Now.instant()
            } as never);
    }

    async rotateSession(oldTokenHash: string, newSession: RefreshSession): Promise<RefreshSession | null> {
        return await db.transaction(async (tx) => {
            const existing = await tx.orm.public.refresh_sessions
                .where({ token_hash: oldTokenHash as never })
                .first();

            if (!existing || existing.revoked_at !== null) {
                return null;
            }

            await tx.orm.public.refresh_sessions
                .where({
                    token_hash: oldTokenHash as never,
                    revoked_at: null as never
                })
                .update({
                    revoked_at: Temporal.Instant.from(newSession.createdAt.toISOString()),
                    updated_at: Temporal.Now.instant()
                } as never);

            const raw = await tx.orm.public.refresh_sessions.create(
                RefreshSessionMapper.toPersistence(newSession) as never
            );

            return RefreshSessionMapper.toDomain(raw as RefreshSessionRaw);
        });
    }
}
