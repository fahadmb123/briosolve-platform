import { CommunicationChannel, CommunicationStatus } from "../../../domain/entities/communication.entity";

export interface CommunicationResponseDto {
    id: string;
    senderId: string | null;
    recipientId: string;
    channel: CommunicationChannel;
    subject: string | null;
    content: string;
    status: CommunicationStatus;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedCommunicationResponseDto {
    communications: CommunicationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

