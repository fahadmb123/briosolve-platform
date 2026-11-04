import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
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

        const participant = await this._participantRepository.findByConversationAndUser(
            input.conversationId,
            input.userId
        );

        if (!participant) {
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

        return messages.map(message => MessageMapper.toDto(message));
    }
}

