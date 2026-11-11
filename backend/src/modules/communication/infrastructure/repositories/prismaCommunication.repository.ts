import { randomUUID } from "node:crypto";
import { Communication } from "../../domain/entities/communication.entity";
import { ICommunicationRepository } from "../../domain/repositories/ICommunicationRepository";
import { SendCommunicationRequestDto } from "../../application/dtos/request/send-communication.dto";
import { GetCommunicationsRequestDto } from "../../application/dtos/request/get-communications.dto";
import { PaginatedCommunicationResponseDto } from "../../application/dtos/response/communication-response.dto";
import { CommunicationMapper } from "../mappers/communication.mapper";

export class PrismaCommunicationRepository implements ICommunicationRepository {
    private readonly _items = new Map<string, Communication>();

    async findById(id: string): Promise<Communication | null> {
        return this._items.get(id) ?? null;
    }

    async create(data: SendCommunicationRequestDto): Promise<Communication> {
        const id = randomUUID();
        const now = new Date();
        const persistenceData = CommunicationMapper.toPersistence(data);
        const communication = CommunicationMapper.toDomain({
            id,
            ...persistenceData,
            created_at: now,
            updated_at: now
        });
        this._items.set(id, communication);
        return communication;
    }

    async findByRecipientId(input: GetCommunicationsRequestDto): Promise<PaginatedCommunicationResponseDto> {
        const { recipientId, channel, status, page = 1, limit = 10 } = input;
        let records = Array.from(this._items.values()).filter(item => item.recipient_id === recipientId);

        if (channel) {
            records = records.filter(item => item.channel === channel);
        }
        if (status) {
            records = records.filter(item => item.status === status);
        }

        records.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

        const total = records.length;
        const skip = (page - 1) * limit;
        const paginated = records.slice(skip, skip + limit);

        return {
            communications: paginated.map(CommunicationMapper.toResponseDto),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1
        };
    }

    async updateStatus(id: string, status: string): Promise<Communication | null> {
        const existing = this._items.get(id);
        if (!existing) return null;

        const updated = new Communication(
            existing.id,
            existing.sender_id,
            existing.recipient_id,
            existing.channel,
            existing.subject,
            existing.content,
            status as Communication["status"],
            existing.metadata,
            existing.created_at,
            new Date()
        );
        this._items.set(id, updated);
        return updated;
    }
}

