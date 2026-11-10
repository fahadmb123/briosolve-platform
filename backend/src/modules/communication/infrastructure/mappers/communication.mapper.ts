import { Communication, CommunicationChannel, CommunicationStatus } from "../../domain/entities/communication.entity";
import { CommunicationResponseDto } from "../../application/dtos/response/communication-response.dto";

export class CommunicationMapper {
    static toDomain(raw: {
        id: string;
        sender_id: string | null;
        recipient_id: string;
        channel: string;
        subject: string | null;
        content: string;
        status: string;
        metadata: unknown;
        created_at: Date | string;
        updated_at: Date | string;
    }): Communication {
        return new Communication(
            raw.id,
            raw.sender_id,
            raw.recipient_id,
            raw.channel as CommunicationChannel,
            raw.subject,
            raw.content,
            raw.status as CommunicationStatus,
            (raw.metadata as Record<string, unknown>) ?? null,
            new Date(raw.created_at),
            new Date(raw.updated_at)
        );
    }

    static toResponseDto(entity: Communication): CommunicationResponseDto {
        return {
            id: entity.id,
            senderId: entity.sender_id,
            recipientId: entity.recipient_id,
            channel: entity.channel,
            subject: entity.subject,
            content: entity.content,
            status: entity.status,
            metadata: entity.metadata,
            createdAt: entity.created_at.toISOString(),
            updatedAt: entity.updated_at.toISOString()
        };
    }
}

