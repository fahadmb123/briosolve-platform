export type MessageType = "TEXT" | "IMAGE" | "FILE";
export type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ";

export class Message {
    constructor(
        public readonly id: string,
        public readonly conversation_id: string,
        public readonly sender_id: string,
        public readonly content: string,
        public readonly message_type: MessageType,
        public readonly created_at: Date,
        public readonly updated_at: Date | null,
        public readonly deleted_at: Date | null
    ) {}
}

