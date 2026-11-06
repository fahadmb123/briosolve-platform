import { Temporal } from "@js-temporal/polyfill";
import { db } from "../../../../shared/database/client";
import { Message } from "../../domain/entities/message.entity";
import {
    CreateMessageData,
    IMessageRepository
} from "../../domain/repositories/IMessageRepository";
import { MessageMapper } from "../mappers/message.mapper";

export class MessageRepository implements IMessageRepository {
    async findById(id: string): Promise<Message | null> {
        const record = await db.orm.public.messages
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return MessageMapper.toDomain(record);
    }

    async create(data: CreateMessageData): Promise<Message> {
        return await db.transaction(async (tx) => {
            const record = await tx.orm.public.messages.create({
                conversation_id: data.conversation_id as never,
                sender_id: data.sender_id as never,
                content: data.content,
                message_type: data.message_type as never
            });

            await tx.orm.public.conversations
                .where({ id: data.conversation_id as never })
                .update({
                    updated_at: Temporal.Now.instant() as never
                });

            return MessageMapper.toDomain(record);
        });
    }

    async findByConversation(
        conversationId: string,
        cursor?: string,
        limit?: number
    ): Promise<Message[]> {
        const records = await db.orm.public.messages
            .where({ conversation_id: conversationId as never })
            .orderBy((m) => m.created_at.asc())
            .all();

        return records.map(record => MessageMapper.toDomain(record));
    }
}
