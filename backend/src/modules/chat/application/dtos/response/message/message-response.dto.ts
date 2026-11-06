import { MessageStatus, MessageType } from "../../../../domain/entities/message.entity";

export interface MessageResponseDto {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: MessageType;
    status?: MessageStatus;
    created_at: Date;
    updated_at: Date | null;
}

