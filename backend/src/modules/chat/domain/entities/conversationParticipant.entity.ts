export class ConversationParticipant {
    constructor(
        public readonly id: string,
        public readonly conversation_id: string,
        public readonly user_id: string,
        public readonly last_read_at: Date | null,
        public readonly joined_at: Date
    ) {}
}

