import { CommunicationChannel, CommunicationStatus } from "../../../domain/entities/communication.entity";

export interface GetCommunicationsRequestDto {
    recipientId: string;
    channel?: CommunicationChannel;
    status?: CommunicationStatus;
    page?: number;
    limit?: number;
}

