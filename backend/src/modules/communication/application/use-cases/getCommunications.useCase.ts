import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ICommunicationRepository } from "../../domain/repositories/ICommunicationRepository";
import { GetCommunicationsRequestDto } from "../dtos/request/get-communications.dto";
import { PaginatedCommunicationResponseDto } from "../dtos/response/communication-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class GetCommunicationsUseCase implements IUseCase<GetCommunicationsRequestDto, PaginatedCommunicationResponseDto> {
    constructor(
        private readonly _communicationRepository: ICommunicationRepository
    ) {}

    async execute(input: GetCommunicationsRequestDto): Promise<PaginatedCommunicationResponseDto> {
        if (!input.recipientId) {
            throw new ApplicationError("BAD_REQUEST", "Recipient ID is required", "VALIDATION");
        }

        return this._communicationRepository.findByRecipientId(input);
    }
}

