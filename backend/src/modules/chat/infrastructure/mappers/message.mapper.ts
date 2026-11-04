import type { Prisma } from "@prisma/client";
import { Message, MessageType } from "../../domain/entities/message.entity";
import { MessageResponseDto } from "../../application/dtos/response/message/message-response.dto";

export type MessageRecord = Prisma.MessageGetPayload<{}>;

export class MessageMapper {
    static toDomain(record: MessageRecord): Message {
        const createdAtRaw: any = record.created_at;
        const updatedAtRaw: any = record.updated_at;
        const deletedAtRaw: any = record.deleted_at;

        const parseDate = (val: any): Date | null => {
            if (!val) return null;
            if (val instanceof Date) return val;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                return new Date(Number(val.epochMilliseconds));
            }
            return new Date(val);
        };

        return new Message(
            record.id,
            record.conversation_id,
            record.sender_id,
            record.content,
            record.message_type as MessageType,
            parseDate(createdAtRaw) ?? new Date(),
            parseDate(updatedAtRaw),
            parseDate(deletedAtRaw)
        );
    }

    static toDto(message: Message): MessageResponseDto {
        return {
            id: message.id,
            conversation_id: message.conversation_id,
            sender_id: message.sender_id,
            content: message.content,
            message_type: message.message_type,
            created_at: message.created_at,
            updated_at: message.updated_at
        };
    }
}

