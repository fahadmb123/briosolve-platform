import { Message } from "../../domain/entities/message.entity";

export interface IMessageDelivery {
    sendToConversation(conversationId: string, message: Message): Promise<void>;
    emitReadReceipt(conversationId: string, readByUserId: string): Promise<void>;
}

