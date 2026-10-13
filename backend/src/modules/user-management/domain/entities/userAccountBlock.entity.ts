export class UserAccountBlock {
    constructor(
        public readonly id: string,
        public readonly user_id: string,
        public readonly blocked_by: string,
        public readonly reason: string,
        public readonly blocked_at: Date,
        public readonly unblocked_at: Date | null,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}
