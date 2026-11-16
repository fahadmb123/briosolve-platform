import type { Prisma } from "@prisma/client";
import { ConversationParticipant } from "../../domain/entities/conversationParticipant.entity";
import { CreateParticipantData } from "../../domain/repositories/IConversationParticipantRepository";

export type ConversationParticipantRecord = Prisma.ConversationParticipantGetPayload<{}>;

export class ConversationParticipantMapper {
    static toDomain(record: ConversationParticipantRecord): ConversationParticipant {
        const lastReadAtRaw: any = record.last_read_at;
        const joinedAtRaw: any = record.joined_at;

        const parseDate = (val: any): Date | null => {
            if (!val) return null;
            if (val instanceof Date) return val;
            if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
                return new Date(Number(val.epochMilliseconds));
            }
            return new Date(val);
        };

        return new ConversationParticipant(
            record.id,
            record.conversation_id,
            record.user_id,
            parseDate(lastReadAtRaw),
            parseDate(joinedAtRaw) ?? new Date()
        );
    }

    static toPersistence(data: CreateParticipantData) {
        return {
            conversation_id: data.conversation_id as never,
            user_id: data.user_id as never
        };
    }
}

