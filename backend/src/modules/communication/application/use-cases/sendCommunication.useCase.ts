import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ICommunicationRepository } from "../../domain/repositories/ICommunicationRepository";
import { SendCommunicationRequestDto } from "../dtos/request/send-communication.dto";
import { CommunicationResponseDto } from "../dtos/response/communication-response.dto";
import { CommunicationMapper } from "../../infrastructure/mappers/communication.mapper";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class SendCommunicationUseCase implements IUseCase<SendCommunicationRequestDto, CommunicationResponseDto> {
    constructor(
        private readonly _communicationRepository: ICommunicationRepository
    ) {}

    async execute(input: SendCommunicationRequestDto): Promise<CommunicationResponseDto> {
        if (!input.recipientId) {
            throw new ApplicationError("BAD_REQUEST", "Recipient ID is required", "VALIDATION");
        }
        if (!input.content || !input.content.trim()) {
            throw new ApplicationError("BAD_REQUEST", "Communication content is required", "VALIDATION");
        }
        if (!input.channel) {
            throw new ApplicationError("BAD_REQUEST", "Communication channel is required", "VALIDATION");
        }

        const created = await this._communicationRepository.create(input);
        return CommunicationMapper.toResponseDto(created);
    }
}

