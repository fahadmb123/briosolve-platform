import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { ConversationParticipant } from "../entities/conversationParticipant.entity";

export interface CreateParticipantInput {
    conversation_id: string;
    user_id: string;
    last_read_at?: Date | null;
    joined_at?: Date;
}

export interface IConversationParticipantRepository extends BaseRepository<ConversationParticipant | null> {
    createMany(data: CreateParticipantInput[]): Promise<void>;

    findByConversationAndUser(conversationId: string, userId: string): Promise<ConversationParticipant | null>;

    updateLastReadAt(
        conversationId: string,
        userId: string
    ): Promise<void>;
}
