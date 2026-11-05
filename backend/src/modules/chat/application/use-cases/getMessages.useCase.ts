import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { MessageStatus } from "../../domain/entities/message.entity";
import { GetMessagesRequestDto } from "../dtos/request/message/get-messages.dto";
import { MessageResponseDto } from "../dtos/response/message/message-response.dto";
import { MessageMapper } from "../../infrastructure/mappers/message.mapper";

export class GetMessagesUseCase implements IUseCase<GetMessagesRequestDto, MessageResponseDto[]> {
    constructor(
        private readonly _participantRepository: IConversationParticipantRepository,
        private readonly _messageRepository: IMessageRepository
    ) {}

    async execute(input: GetMessagesRequestDto): Promise<MessageResponseDto[]> {
        if (!input.conversationId || !input.userId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "Conversation ID and User ID are required",
                "VALIDATION"
            );
        }

        const participants = await this._participantRepository.findByConversationId(input.conversationId);
        const currentParticipant = participants.find(p => p.user_id === input.userId);

        if (!currentParticipant) {
            throw new ApplicationError(
                "NOT_CONVERSATION_PARTICIPANT",
                "You are not allowed to access this conversation",
                "AUTHORIZATION"
            );
        }

        const messages = await this._messageRepository.findByConversation(
            input.conversationId,
            input.cursor,
            input.limit
        );

        const otherParticipant = participants.find(p => p.user_id !== input.userId);
        const otherLastRead = otherParticipant?.last_read_at
            ? new Date(otherParticipant.last_read_at).getTime()
            : 0;

        return messages.map(message => {
            let status: MessageStatus = "DELIVERED";
            if (message.sender_id === input.userId) {
                const msgTime = new Date(message.created_at).getTime();
                status = otherLastRead >= msgTime ? "READ" : "DELIVERED";
            } else {
                status = "READ";
            }
            return MessageMapper.toDto(message, status);
        });
    }
}

