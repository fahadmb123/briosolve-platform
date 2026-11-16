import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { ConversationParticipant } from "../../domain/entities/conversationParticipant.entity";
import {
    CreateParticipantData,
    IConversationParticipantRepository
} from "../../domain/repositories/IConversationParticipantRepository";
import { ConversationParticipantMapper } from "../mappers/conversationParticipant.mapper";

export class ConversationParticipantRepository implements IConversationParticipantRepository {
    async findById(id: string): Promise<ConversationParticipant | null> {
        const record = await db.orm.public.conversation_participants
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return ConversationParticipantMapper.toDomain(record);
    }

    async createMany(data: CreateParticipantData[]): Promise<ConversationParticipant[]> {
        return await db.transaction(async (tx) => {
            const records = await Promise.all(
                data.map(item =>
                    tx.orm.public.conversation_participants.create(
                        ConversationParticipantMapper.toPersistence(item) as never
                    )
                )
            );

            return records.map(record => ConversationParticipantMapper.toDomain(record));
        });
    }

    async findByConversationAndUser(conversationId: string,userId: string): Promise<ConversationParticipant | null> {
        const record = await db.orm.public.conversation_participants
            .where({
                conversation_id: conversationId as never,
                user_id: userId as never
            })
            .first();

        if (!record) return null;
        return ConversationParticipantMapper.toDomain(record);
    }

    async findByConversationId(conversationId: string): Promise<ConversationParticipant[]> {
        const records = await db.orm.public.conversation_participants
            .where({ conversation_id: conversationId as never })
            .all();

        return records.map(record => ConversationParticipantMapper.toDomain(record));
    }

    async updateLastReadAt(conversationId: string, userId: string): Promise<void> {
        await db.transaction(async (tx) => {
            const participant = await tx.orm.public.conversation_participants
                .where({
                    conversation_id: conversationId as never,
                    user_id: userId as never
                })
                .first();

            if (!participant) return;

            await tx.orm.public.conversation_participants
                .where({ id: participant.id as never })
                .update({
                    last_read_at: Temporal.Now.instant() as never
                });
        });
    }
}
