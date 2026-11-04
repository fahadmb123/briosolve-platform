import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Message, MessageType } from "../entities/message.entity";

export interface CreateMessageData {
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: MessageType;
}

export interface IMessageRepository extends BaseRepository<Message | null>{
    create(data: CreateMessageData): Promise<Message>;

    findByConversation(conversationId: string,cursor?: string,limit?: number): Promise<Message[]>;
}

