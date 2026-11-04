import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { GetConversationsRequestDto } from "../dtos/request/conversation/get-conversations.dto";
import { ConversationResponseDto } from "../dtos/response/conversation/conversation-response.dto";
import { ConversationMapper } from "../../infrastructure/mappers/conversation.mapper";

export class GetConversationsUseCase implements IUseCase<GetConversationsRequestDto, ConversationResponseDto[]> {
    constructor(
        private readonly _conversationRepository: IConversationRepository
    ) {}

    async execute(input: GetConversationsRequestDto): Promise<ConversationResponseDto[]> {
        if (!input.userId) {
            throw new ApplicationError(
                "VALIDATION_ERROR",
                "User ID is required",
                "VALIDATION"
            );
        }

        const conversations = await this._conversationRepository.findByUserId(input.userId);

        return conversations.map(conversation => ConversationMapper.toDto(conversation));
    }
}

