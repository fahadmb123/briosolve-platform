import { User } from "./user.entity";
import { UserAccountBlock } from "./userAccountBlock.entity";

export class AccountReactivationRequest {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly block_id: string,
        public readonly reason: string,
        public readonly status: "PENDING" | "APPROVED" | "REJECTED",
        public readonly reviewed_by: string | null,
        public readonly reviewed_at: Date | null,
        public readonly created_at: Date,
        public readonly updated_at: Date,
        public readonly user?: User,
        public readonly block?: UserAccountBlock,
        public readonly reviewer?: User | null
    ) {}
}
