import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { GetConversationsRequestDto } from "../dtos/request/conversation/get-conversations.dto";
import { ConversationResponseDto } from "../dtos/response/conversation/conversation-response.dto";

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

        return await this._conversationRepository.findByUserIdWithDetails(input.userId);
    }
}

