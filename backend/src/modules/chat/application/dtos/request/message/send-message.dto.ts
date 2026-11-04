import { MessageType } from "../../../../domain/entities/message.entity";

export interface SendMessageRequestDto {
    conversationId: string;
    senderId: string;
    content: string;
    messageType: MessageType;
}

