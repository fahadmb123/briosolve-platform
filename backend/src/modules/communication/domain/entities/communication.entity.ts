export type CommunicationChannel = "EMAIL" | "SMS" | "IN_APP" | "PUSH";
export type CommunicationStatus = "PENDING" | "SENT" | "DELIVERED" | "FAILED" | "READ";

export class Communication {
    constructor(
        public readonly id: string,
        public readonly sender_id: string | null,
        public readonly recipient_id: string,
        public readonly channel: CommunicationChannel,
        public readonly subject: string | null,
        public readonly content: string,
        public readonly status: CommunicationStatus,
        public readonly metadata: Record<string, unknown> | null,
        public readonly created_at: Date,
        public readonly updated_at: Date
    ) {}
}

