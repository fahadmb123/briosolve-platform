import type { Prisma } from "@prisma/client";
import { Conversation, ConversationStatus } from "../../domain/entities/conversation.entity";
import { ConversationResponseDto } from "../../application/dtos/response/conversation-response.dto";

export type ConversationRecord = Prisma.ConversationGetPayload<{}>;

export class ConversationMapper {
    static toDomain(record: ConversationRecord): Conversation {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;

        const parseDate = (val: any): Date => {
            if (!val) return new Date();
            if (val instanceof Date) return val;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                return new Date(Number(val.epochMilliseconds));
            }
            return new Date(val);
        };

        return new Conversation(
            record.id,
            record.status as ConversationStatus,
            parseDate(createdAtRaw),
            parseDate(updatedAtRaw)
        );
    }

    static toDto(conversation: Conversation): ConversationResponseDto {
        return {
            id: conversation.id,
            status: conversation.status,
            created_at: conversation.created_at
        };
    }
}

