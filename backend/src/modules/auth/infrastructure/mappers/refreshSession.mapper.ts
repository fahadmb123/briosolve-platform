import { RefreshSession } from "../../domain/entities/refreshSession.entity";

export type RefreshSessionRaw = {
    id: string;
    user_id: string;
    token_hash: string;
    family_id: string;
    expires_at: any;
    revoked_at?: any | null;
    user_agent?: string | null;
    ip_address?: string | null;
    created_at: any;
    updated_at: any;
};

export class RefreshSessionMapper {
    static toDomain(data: RefreshSessionRaw): RefreshSession {
        return new RefreshSession(
            data.id,
            data.user_id,
            data.token_hash,
            data.family_id,
            data.expires_at?.epochMilliseconds ? new Date(data.expires_at.epochMilliseconds) : new Date(data.expires_at),
            data.revoked_at ? (data.revoked_at?.epochMilliseconds ? new Date(data.revoked_at.epochMilliseconds) : new Date(data.revoked_at)) : null,
            data.user_agent ?? null,
            data.ip_address ?? null,
            data.created_at?.epochMilliseconds ? new Date(data.created_at.epochMilliseconds) : new Date(data.created_at),
            data.updated_at?.epochMilliseconds ? new Date(data.updated_at.epochMilliseconds) : new Date(data.updated_at)
        );
    }
}
