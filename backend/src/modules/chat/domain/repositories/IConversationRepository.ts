import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Conversation } from "../entities/conversation.entity";
import { ConversationResponseDto } from "../../application/dtos/response/conversation/conversation-response.dto";

export interface IConversationRepository extends BaseRepository<Conversation | null>{
    create(): Promise<Conversation | null>;

    findById(id: string): Promise<Conversation | null>;

    findDirectConversation(userId: string,recipientId: string): Promise<Conversation | null>;

    findByUserId(userId: string): Promise<Conversation[]>;

    findByUserIdWithDetails(userId: string): Promise<ConversationResponseDto[]>;

    findByIdWithDetails(id: string, userId: string): Promise<ConversationResponseDto | null>;
}
