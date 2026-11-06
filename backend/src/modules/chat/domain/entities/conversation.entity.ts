export type ConversationStatus = "ACTIVE" | "CLOSED";

export class Conversation {
    constructor(
        public readonly id: string,
        public readonly status: ConversationStatus,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}

