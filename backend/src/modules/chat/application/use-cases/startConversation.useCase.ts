import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { StartConversationRequestDto } from "../dtos/request/start-conversation.dto";
import { ConversationResponseDto } from "../dtos/response/conversation-response.dto";

export class StartConversationUseCase implements IUseCase<StartConversationRequestDto, ConversationResponseDto> {
    constructor(
        private readonly _conversationRepository: IConversationRepository,
        private readonly _participantRepository: IConversationParticipantRepository
    ) {}

    async execute(input: StartConversationRequestDto): Promise<ConversationResponseDto> {
        if (!input.userId || !input.recipientId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "User ID and Recipient ID are required",
                "VALIDATION"
            );
        }

        if (input.userId === input.recipientId) {
            throw new ApplicationError(
                "CANNOT_CHAT_WITH_SELF",
                "You cannot start a conversation with yourself",
                "VALIDATION"
            );
        }

        const existingConversation = await this._conversationRepository.findDirectConversation(
            input.userId,
            input.recipientId
        );

        if (existingConversation) return existingConversation

        const conversation = await this._conversationRepository.create();

        if (!conversation) {
            throw new ApplicationError(
                "CONVERSATION_CREATE_FAILED",
                "Failed to create conversation",
                "INTERNAL"
            );
        }

        await this._participantRepository.createMany([
            {
                conversation_id: conversation.id,
                user_id: input.userId
            },
            {
                conversation_id: conversation.id,
                user_id: input.recipientId
            }
        ]);

        return {
            id: conversation.id,
            status: conversation.status,
            created_at: conversation.created_at
        };
    }
}

