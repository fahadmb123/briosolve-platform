import { CommunicationChannel } from "../../../domain/entities/communication.entity";

export interface SendCommunicationRequestDto {
    senderId?: string | null;
    recipientId: string;
    channel: CommunicationChannel;
    subject?: string | null;
    content: string;
    metadata?: Record<string, unknown> | null;
}

