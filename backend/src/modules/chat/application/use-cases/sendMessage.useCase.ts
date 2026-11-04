import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IConversationParticipantRepository } from "../../domain/repositories/IConversationParticipantRepository";
import { IMessageRepository } from "../../domain/repositories/IMessageRepository";
import { SendMessageRequestDto } from "../dtos/request/send-message.dto";
import { MessageResponseDto } from "../dtos/response/message-response.dto";
import { MessageMapper } from "../../infrastructure/mappers/message.mapper";
import { IMessageDelivery } from "../interfaces/IMessageDelivery";

export class SendMessageUseCase implements IUseCase<SendMessageRequestDto, MessageResponseDto> {
    constructor(
        private readonly _conversationRepository: IConversationRepository,
        private readonly _participantRepository: IConversationParticipantRepository,
        private readonly _messageRepository: IMessageRepository,
        private _messageDelivery: IMessageDelivery
    ) {}

    async execute(input: SendMessageRequestDto): Promise<MessageResponseDto> {
        if (!input.conversationId || !input.senderId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "Conversation ID and Sender ID are required",
                "VALIDATION"
            );
        }

        if (!input.content || !input.content.trim()) {
            throw new ApplicationError(
                "MESSAGE_CONTENT_REQUIRED",
                "Message content cannot be empty",
                "VALIDATION"
            );
        }

        const conversation = await this._conversationRepository.findById(input.conversationId);

        if (!conversation) {
            throw new ApplicationError(
                "CONVERSATION_NOT_FOUND",
                "Conversation not found",
                "NOT_FOUND"
            );
        }

        if (conversation.status !== "ACTIVE") {
            throw new ApplicationError(
                "CONVERSATION_INACTIVE",
                "This conversation is not active",
                "VALIDATION"
            );
        }

        const participant = await this._participantRepository.findByConversationAndUser(
            input.conversationId,
            input.senderId
        );

        if (!participant) {
            throw new ApplicationError(
                "NOT_CONVERSATION_PARTICIPANT",
                "You are not a participant of this conversation",
                "AUTHORIZATION"
            );
        }

        const message = await this._messageRepository.create({
            conversation_id: input.conversationId,
            sender_id: input.senderId,
            content: input.content.trim(),
            message_type: input.messageType
        });

        if (!message) {
            throw new ApplicationError(
                "MESSAGE_SEND_FAILED",
                "Failed to send message",
                "INTERNAL"
            );
        }

        await this._messageDelivery.sendToConversation(
            input.conversationId,
            message
        );

        return MessageMapper.toDto(message);
    }
}
