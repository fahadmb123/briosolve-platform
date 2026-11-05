import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { IMessageDelivery } from "../interfaces/IMessageDelivery";
import { MarkMessagesAsReadRequestDto } from "../dtos/request/message/mark-messages-as-read.dto";

export class MarkMessagesAsReadUseCase implements IUseCase<MarkMessagesAsReadRequestDto, void> {
    constructor(
        private readonly _participantRepository: IConversationParticipantRepository,
        private readonly _messageDelivery: IMessageDelivery
    ) {}

    async execute(input: MarkMessagesAsReadRequestDto): Promise<void> {
        if (!input.conversationId || !input.userId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "Conversation ID and User ID are required",
                "VALIDATION"
            );
        }

        const participants = await this._participantRepository.findByConversationId(input.conversationId);
        const participant = participants.find(p => p.user_id === input.userId);

        if (!participant) {
            throw new ApplicationError(
                "NOT_CONVERSATION_PARTICIPANT",
                "You are not a participant of this conversation",
                "AUTHORIZATION"
            );
        }

        await this._participantRepository.updateLastReadAt(
            input.conversationId,
            input.userId
        );

        const participantUserIds = participants.map(p => p.user_id);
        await this._messageDelivery.emitReadReceipt(input.conversationId, input.userId, participantUserIds);
    }
}

