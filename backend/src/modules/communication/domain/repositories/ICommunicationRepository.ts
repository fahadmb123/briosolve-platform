import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { Communication } from "../entities/communication.entity";
import { SendCommunicationRequestDto } from "../../application/dtos/request/send-communication.dto";
import { GetCommunicationsRequestDto } from "../../application/dtos/request/get-communications.dto";
import { PaginatedCommunicationResponseDto } from "../../application/dtos/response/communication-response.dto";

export interface ICommunicationRepository extends BaseRepository<Communication | null> {
    create(data: SendCommunicationRequestDto): Promise<Communication>;
    findByRecipientId(input: GetCommunicationsRequestDto): Promise<PaginatedCommunicationResponseDto>;
    updateStatus(id: string, status: string): Promise<Communication | null>;
}

