import { Message } from "../../domain/entities/message.entity";

export interface IMessageDelivery {
    sendToConversation(conversationId: string, message: Message, recipientUserIds?: string[]): Promise<void>;
    emitReadReceipt(conversationId: string, readByUserId: string, recipientUserIds?: string[]): Promise<void>;
}