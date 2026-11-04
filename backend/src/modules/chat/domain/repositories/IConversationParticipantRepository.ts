import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { ConversationParticipant } from "../entities/conversationParticipant.entity";

export interface CreateParticipantData {
    conversation_id: string;
    user_id: string;
}


export interface IConversationParticipantRepository extends BaseRepository<ConversationParticipant | null>{
    createMany(data: CreateParticipantData[]): Promise<ConversationParticipant[]>;

    findByConversationAndUser(conversationId: string,userId: string): Promise<ConversationParticipant | null>;

    findByConversationId(conversationId: string): Promise<ConversationParticipant[]>;

    updateLastReadAt(conversationId: string,userId: string): Promise<void>;
}
