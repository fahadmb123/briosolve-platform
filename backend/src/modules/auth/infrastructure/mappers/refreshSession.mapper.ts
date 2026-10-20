import { Temporal } from "@js-temporal/polyfill";
import type { Prisma } from "@prisma/client";
import { RefreshSession } from "../../domain/entities/refreshSession.entity";

export type RefreshSessionRecord = Prisma.RefreshSessionGetPayload<{}>;
export type RefreshSessionRaw = RefreshSessionRecord;

export class RefreshSessionMapper {
    static toDomain(record: RefreshSessionRecord): RefreshSession {
        const expiresAtRaw: any = record.expires_at;
        const revokedAtRaw: any = record.revoked_at;
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        return new RefreshSession(
            record.id,
            record.user_id,
            record.token_hash,
            record.family_id,
            expiresAtRaw?.epochMilliseconds ? new Date(Number(expiresAtRaw.epochMilliseconds)) : new Date(expiresAtRaw),
            revokedAtRaw ? (revokedAtRaw?.epochMilliseconds ? new Date(Number(revokedAtRaw.epochMilliseconds)) : new Date(revokedAtRaw)) : null,
            record.user_agent ?? null,
            record.ip_address ?? null,
            createdAtRaw?.epochMilliseconds ? new Date(Number(createdAtRaw.epochMilliseconds)) : new Date(createdAtRaw),
            updatedAtRaw?.epochMilliseconds ? new Date(Number(updatedAtRaw.epochMilliseconds)) : new Date(updatedAtRaw)
        );
    }

    static toPersistence(session: RefreshSession) {
        return {
            id: session.id as never,
            user_id: session.userId as never,
            token_hash: session.tokenHash as never,
            family_id: session.familyId as never,
            expires_at: Temporal.Instant.from(session.expiresAt.toISOString()),
            revoked_at: session.revokedAt ? Temporal.Instant.from(session.revokedAt.toISOString()) : (null as never),
            user_agent: session.userAgent as never,
            ip_address: session.ipAddress as never,
            created_at: Temporal.Instant.from(session.createdAt.toISOString()),
            updated_at: Temporal.Instant.from(session.updatedAt.toISOString())
        };
    }
}
