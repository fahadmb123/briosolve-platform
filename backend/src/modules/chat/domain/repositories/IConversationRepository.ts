import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Conversation } from "../entities/conversation.entity";

export interface IConversationRepository extends BaseRepository<Conversation | null>{
    create(): Promise<Conversation | null>;

    findById(id: string): Promise<Conversation | null>;

    findDirectConversation(userId: string,recipientId: string): Promise<Conversation | null>;
}