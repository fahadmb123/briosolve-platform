import { Message } from "../../domain/entities/message.entity";

export interface IMessageDelivery {
    sendToConversation(conversationId: string, message: Message, participantUserIds?: string[]): Promise<void>;
    emitReadReceipt(conversationId: string, readByUserId: string, participantUserIds?: string[]): Promise<void>;
}