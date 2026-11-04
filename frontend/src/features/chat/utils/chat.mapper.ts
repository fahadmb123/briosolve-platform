import type { BackendConversationDto, BackendMessageDto } from "../services/chat.service";
import type { ChatConversation, ChatMessage, ChatParticipant } from "../types/chat.types";

export function toChatMessage(dto: BackendMessageDto, currentUserId?: string): ChatMessage {
    const isMe = currentUserId ? dto.sender_id === currentUserId : false;

    const createdAtDate = new Date(dto.created_at);
    const timeFormatted = isNaN(createdAtDate.getTime())
        ? ""
        : createdAtDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
        id: dto.id,
        conversationId: dto.conversation_id,
        senderId: dto.sender_id,
        senderRole: isMe ? "CUSTOMER" : "PROVIDER",
        senderName: isMe ? "You" : "Participant",
        text: dto.content,
        type: dto.message_type === "IMAGE" ? "IMAGE" : "TEXT",
        status: "SENT",
        createdAt: timeFormatted
    };
}

export function toChatConversation(
    dto: BackendConversationDto,
    fallbackParticipant?: Partial<ChatParticipant>
): ChatConversation {
    return {
        id: dto.id,
        participant: {
            id: fallbackParticipant?.id || dto.id,
            name: fallbackParticipant?.name || "Participant",
            role: fallbackParticipant?.role || "PROVIDER",
            avatar: fallbackParticipant?.avatar,
            businessName: fallbackParticipant?.businessName,
            rating: fallbackParticipant?.rating || 5.0,
            reviewsCount: fallbackParticipant?.reviewsCount || 0,
            isVerified: fallbackParticipant?.isVerified ?? true,
            isOnline: fallbackParticipant?.isOnline ?? true,
        },
        linkedRequest: {
            id: "req-active",
            title: "General Service Inquiry",
            categoryName: "Services",
            urgency: "FLEXIBLE",
            budgetType: "OPEN_BID",
            status: "ACTIVE",
            location: "Active Service Area",
        },
        lastMessage: {
            text: "",
            senderId: "",
            createdAt: new Date(dto.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isUnread: false,
        },
        unreadCount: 0,
        hasActiveQuote: false,
        updatedAt: dto.created_at,
    };
}
