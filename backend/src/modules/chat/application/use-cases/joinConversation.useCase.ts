import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { JoinConversationRequestDto } from "../dtos/request/conversation/join-conversation.dto";

export class JoinConversationUseCase implements IUseCase<JoinConversationRequestDto, void> {
    constructor(
        private readonly _participantRepository: IConversationParticipantRepository
    ) {}

    async execute(input: JoinConversationRequestDto): Promise<void> {
        if (!input.conversationId || !input.userId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "Conversation ID and User ID are required",
                "VALIDATION"
            );
        }

        const participant = await this._participantRepository.findByConversationAndUser(
            input.conversationId,
            input.userId
        );

        if (!participant) {
            throw new ApplicationError(
                "NOT_CONVERSATION_PARTICIPANT",
                "You are not a participant of this conversation",
                "AUTHORIZATION"
            );
        }
    }
}
