import { AccountReactivationRequest } from "../../domain/entities/accountReactivationRequest.entity.js";

export class AccountReactivationRequestMapper {
    static toDomain(raw: any): AccountReactivationRequest {
        return new AccountReactivationRequest(
            raw.id,
            raw.user_id,
            raw.block_id,
            raw.reason,
            raw.status,
            raw.reviewed_by || null,
            raw.reviewed_at ? (raw.reviewed_at?.epochMilliseconds ? new Date(raw.reviewed_at.epochMilliseconds) : new Date(raw.reviewed_at)) : null,
            raw.created_at?.epochMilliseconds ? new Date(raw.created_at.epochMilliseconds) : new Date(raw.created_at),
            raw.updated_at?.epochMilliseconds ? new Date(raw.updated_at.epochMilliseconds) : new Date(raw.updated_at)
        );
    }
}
