import { db } from "../../../../shared/database/client";
import { Conversation } from "../../domain/entities/conversation.entity";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ConversationMapper } from "../mappers/conversation.mapper";
import { ConversationResponseDto } from "../../application/dtos/response/conversation/conversation-response.dto";

function parseDate(val: unknown): Date {
    if (!val) return new Date();
    if (val instanceof Date) return val;
    if (typeof val === "object" && val !== null && "epochMilliseconds" in val) {
        return new Date(Number((val as { epochMilliseconds: number }).epochMilliseconds));
    }
    return new Date(val as string | number);
}

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

    async findByUserIdWithDetails(userId: string): Promise<ConversationResponseDto[]> {
        const participantRecords = await db.orm.public.conversation_participants
            .where({ user_id: userId as never })
            .include("conversation")
            .all();

        const dtos = await Promise.all(
            participantRecords
                .filter((p) => p.conversation !== null)
                .map((p) => this.buildConversationDetails(p.conversation, p, userId))
        );

        return dtos.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
    }

    async findByIdWithDetails(conversationId: string, userId: string): Promise<ConversationResponseDto | null> {
        const userPart = await db.orm.public.conversation_participants
            .where({ conversation_id: conversationId as never, user_id: userId as never })
            .include("conversation")
            .first();

        if (!userPart || !userPart.conversation) {
            return null;
        }

        return this.buildConversationDetails(userPart.conversation, userPart, userId);
    }

    private async buildConversationDetails(conv: any, userPart: any, userId: string): Promise<ConversationResponseDto> {
        const allParticipants = await db.orm.public.conversation_participants
            .where({ conversation_id: conv.id as never })
            .include("user")
            .all();

        const otherPart = allParticipants.find((p) => p.user_id !== userId);
        const otherUser = otherPart?.user ?? null;

        let participantDto: ConversationResponseDto["participant"] = undefined;
        let customerId: string | null = null;
        let providerProfile: any = null;

        if (otherUser) {
            let avatar: string | null = null;
            let businessName: string | null = null;
            let isVerified = true;

            if (otherUser.role === "PROVIDER") {
                providerProfile = await db.orm.public.provider_profiles
                    .where({ user_id: otherUser.id as never })
                    .first();
                if (providerProfile) {
                    businessName = providerProfile.business_name || null;
                    avatar = providerProfile.profile_image || null;
                    isVerified = providerProfile.kyc_status === "APPROVED";
                }
                customerId = userId;
            } else {
                const customerProfile = await db.orm.public.customer_profiles
                    .where({ user_id: otherUser.id as never })
                    .first();
                if (customerProfile) {
                    avatar = customerProfile.profile_image || null;
                }
                customerId = otherUser.id;
                providerProfile = await db.orm.public.provider_profiles
                    .where({ user_id: userId as never })
                    .first();
            }

            participantDto = {
                id: otherUser.id,
                name: otherUser.name,
                role: otherUser.role as "CUSTOMER" | "PROVIDER",
                avatar,
                business_name: businessName,
                phone: otherUser.phone || null,
                is_verified: isVerified,
                is_online: true
            };
        }

        const messages = await db.orm.public.messages
            .where({ conversation_id: conv.id as never })
            .orderBy((m) => m.created_at.desc())
            .all();

        const latestMsg = messages[0];
        const lastReadTime = userPart?.last_read_at
            ? parseDate(userPart.last_read_at).getTime()
            : 0;

        let lastMessageDto: ConversationResponseDto["last_message"] = {
            text: "",
            sender_id: "",
            created_at: parseDate(conv.created_at),
            is_unread: false
        };

        if (latestMsg) {
            const msgTime = parseDate(latestMsg.created_at).getTime();
            lastMessageDto = {
                text: latestMsg.content,
                sender_id: latestMsg.sender_id,
                created_at: parseDate(latestMsg.created_at),
                is_unread: latestMsg.sender_id !== userId && msgTime > lastReadTime
            };
        }

        const unreadCount = messages.filter((m) => {
            if (m.sender_id === userId) return false;
            if (!userPart?.last_read_at) return true;
            return parseDate(m.created_at).getTime() > lastReadTime;
        }).length;

        let linkedRequestDto: ConversationResponseDto["linked_request"] = null;
        if (customerId && providerProfile) {
            const providerMatches = await db.orm.public.service_request_providers
                .where({ provider_id: providerProfile.id as never })
                .all();

            if (providerMatches.length > 0) {
                const requestMatches = await Promise.all(
                    providerMatches.map((pm) =>
                        db.orm.public.service_requests
                            .where({ id: pm.service_request_id as never, customer_id: customerId as never })
                            .include("category")
                            .include("subservice")
                            .include("address")
                            .first()
                    )
                );

                const validRequests = requestMatches.filter((r): r is NonNullable<typeof r> => r !== null);
                if (validRequests.length > 0) {
                    validRequests.sort(
                        (a, b) => parseDate(b.created_at).getTime() - parseDate(a.created_at).getTime()
                    );
                    const activeReq = validRequests[0];
                    const loc = [activeReq.address?.area, activeReq.address?.city]
                        .filter(Boolean)
                        .join(", ");
                    const scheduledTime =
                        activeReq.available_time_from && activeReq.available_time_to
                            ? `${activeReq.available_time_from} - ${activeReq.available_time_to}`
                            : null;

                    linkedRequestDto = {
                        id: activeReq.id,
                        title: activeReq.title,
                        category_name: activeReq.category?.name || "Services",
                        subservice_name: activeReq.subservice?.name || null,
                        urgency: activeReq.urgency,
                        budget_type: activeReq.budget_type,
                        budget_amount: activeReq.budget_amount ? Number(activeReq.budget_amount) : null,
                        status: activeReq.status,
                        location: loc || null,
                        scheduled_time: scheduledTime
                    };
                }
            }
        }

        const effectiveUpdatedAt = latestMsg
            ? parseDate(latestMsg.created_at)
            : parseDate(conv.updated_at || conv.created_at);

        return {
            id: conv.id,
            status: conv.status,
            created_at: parseDate(conv.created_at),
            updated_at: effectiveUpdatedAt,
            participant: participantDto,
            last_message: lastMessageDto,
            unread_count: unreadCount,
            linked_request: linkedRequestDto
        };
    }
}

