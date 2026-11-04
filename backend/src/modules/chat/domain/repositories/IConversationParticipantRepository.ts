import { ConversationParticipant } from "../entities/conversationParticipant.entity";

export interface CreateParticipantData {
    conversation_id: string;
    user_id: string;
}

export interface IConversationParticipantRepository {
    createMany(data: CreateParticipantData[]): Promise<ConversationParticipant[] | null>;

    findByConversationAndUser(conversationId: string,userId: string): Promise<ConversationParticipant | null>;

    findByConversationId(conversationId: string): Promise<ConversationParticipant[] | null>;

    updateLastReadAt(conversationId: string, userId: string): Promise<void>;
}
