import { db } from "../../../../shared/database/client";
import { Conversation } from "../../domain/entities/conversation.entity";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ConversationMapper } from "../mappers/conversation.mapper";

export class ConversationRepository implements IConversationRepository {
    async create(): Promise<Conversation | null> {
        const record = await db.orm.public.conversations.create({
            type: "DIRECT",
            status: "ACTIVE"
        });

        if (!record) return null;
        return ConversationMapper.toDomain(record);
    }

    async findById(id: string): Promise<Conversation | null> {
        const record = await db.orm.public.conversations
            .where({ id: id as never })
            .first();

        if (!record) return null;
        return ConversationMapper.toDomain(record);
    }

    async findDirectConversation(userId: string, recipientId: string): Promise<Conversation | null> {
        const [userParticipants, recipientParticipants] = await Promise.all([
            db.orm.public.conversation_participants
                .where({ user_id: userId as never })
                .all(),
            db.orm.public.conversation_participants
                .where({ user_id: recipientId as never })
                .all()
        ]);

        if (userParticipants.length === 0 || recipientParticipants.length === 0) {
            return null;
        }

        const userConvIds = new Set(userParticipants.map(p => p.conversation_id));
        const sharedConvId = recipientParticipants
            .map(p => p.conversation_id)
            .find(convId => userConvIds.has(convId));

        if (!sharedConvId) {
            return null;
        }

        const conv = await db.orm.public.conversations
            .where({ id: sharedConvId as never, type: "DIRECT" as never })
            .first();

        return conv ? ConversationMapper.toDomain(conv) : null;
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const participantRecords = await db.orm.public.conversation_participants
            .where({ user_id: userId as never })
            .include("conversation")
            .all();

        return participantRecords
            .map(p => p.conversation)
            .filter((c): c is NonNullable<typeof c> => c !== null)
            .map(c => ConversationMapper.toDomain(c))
            .sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
    }
}
