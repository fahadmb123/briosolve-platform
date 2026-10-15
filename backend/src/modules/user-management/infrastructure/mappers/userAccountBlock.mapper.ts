import { UserAccountBlock } from "../../domain/entities/userAccountBlock.entity";

export class UserAccountBlockMapper {
    static toDomain(raw: any): UserAccountBlock {
        return new UserAccountBlock(
            raw.id,
            raw.user_id,
            raw.blocked_by,
            raw.reason,
            raw.blocked_at?.epochMilliseconds ? new Date(raw.blocked_at.epochMilliseconds) : new Date(raw.blocked_at),
            raw.unblocked_at ? (raw.unblocked_at?.epochMilliseconds ? new Date(raw.unblocked_at.epochMilliseconds) : new Date(raw.unblocked_at)) : null,
            raw.created_at?.epochMilliseconds ? new Date(raw.created_at.epochMilliseconds) : new Date(raw.created_at),
            raw.updated_at?.epochMilliseconds ? new Date(raw.updated_at.epochMilliseconds) : new Date(raw.updated_at)
        );
    }
}
