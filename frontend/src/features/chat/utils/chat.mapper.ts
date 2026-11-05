import type { BackendConversationDto, BackendMessageDto } from "../services/chat.service";
import type { ChatConversation, ChatLinkedRequest, ChatMessage, ChatParticipant } from "../types/chat.types";

export function toChatMessage(
    dto: BackendMessageDto,
    currentUserId?: string,
    currentUserRole?: "CUSTOMER" | "PROVIDER"
): ChatMessage {
    const isMe = currentUserId ? dto.sender_id === currentUserId : false;

    const createdAtDate = new Date(dto.created_at);
    const timeFormatted = isNaN(createdAtDate.getTime())
        ? ""
        : createdAtDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const role = isMe
        ? (currentUserRole || "CUSTOMER")
        : (currentUserRole === "PROVIDER" ? "CUSTOMER" : "PROVIDER");

    return {
        id: dto.id,
        conversationId: dto.conversation_id,
        senderId: dto.sender_id,
        senderRole: role,
        senderName: isMe ? "You" : (role === "PROVIDER" ? "Provider" : "Customer"),
        text: dto.content,
        type: dto.message_type === "IMAGE" ? "IMAGE" : "TEXT",
        status: "SENT",
        createdAt: timeFormatted
    };
}

export function toChatConversation(
    dto: BackendConversationDto,
    fallbackParticipant?: Partial<ChatParticipant>,
    fallbackRequest?: Partial<ChatLinkedRequest>
): ChatConversation {
    const participantName = dto.participant?.name || fallbackParticipant?.name || "Participant";
    const participantRole = dto.participant?.role || fallbackParticipant?.role || "PROVIDER";
    const participantAvatar = dto.participant?.avatar || fallbackParticipant?.avatar;
    const participantBusiness = dto.participant?.business_name || fallbackParticipant?.businessName;
    const isVerified = dto.participant?.is_verified ?? fallbackParticipant?.isVerified ?? true;
    const isOnline = dto.participant?.is_online ?? fallbackParticipant?.isOnline ?? true;
    const phone = dto.participant?.phone || fallbackParticipant?.phone;

    const linkedRequest: ChatLinkedRequest = dto.linked_request ? {
        id: dto.linked_request.id,
        title: dto.linked_request.title,
        categoryName: dto.linked_request.category_name,
        subserviceName: dto.linked_request.subservice_name || undefined,
        urgency: dto.linked_request.urgency,
        budgetType: dto.linked_request.budget_type,
        budgetAmount: dto.linked_request.budget_amount != null ? Number(dto.linked_request.budget_amount) : undefined,
        status: dto.linked_request.status,
        scheduledTime: dto.linked_request.scheduled_time || undefined,
        location: dto.linked_request.location || "Active Service Area",
    } : {
        id: fallbackRequest?.id || "req-active",
        title: fallbackRequest?.title || "General Service Inquiry",
        categoryName: fallbackRequest?.categoryName || "Services",
        subserviceName: fallbackRequest?.subserviceName,
        urgency: fallbackRequest?.urgency || "FLEXIBLE",
        budgetType: fallbackRequest?.budgetType || "OPEN_BID",
        budgetAmount: fallbackRequest?.budgetAmount,
        status: fallbackRequest?.status || "ACTIVE",
        location: fallbackRequest?.location || "Active Service Area",
        scheduledTime: fallbackRequest?.scheduledTime,
    };

    const lastMsgDateRaw = dto.last_message?.created_at || dto.created_at;
    const lastMsgDate = lastMsgDateRaw ? new Date(lastMsgDateRaw) : new Date();
    const timeFormatted = isNaN(lastMsgDate.getTime())
        ? ""
        : lastMsgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return {
        id: dto.id,
        participant: {
            id: dto.participant?.id || fallbackParticipant?.id || dto.id,
            name: participantName,
            role: participantRole,
            avatar: participantAvatar,
            businessName: participantBusiness,
            rating: fallbackParticipant?.rating || 5.0,
            reviewsCount: fallbackParticipant?.reviewsCount || 0,
            isVerified,
            isOnline,
            phone,
        },
        linkedRequest,
        lastMessage: {
            text: dto.last_message?.text ?? "",
            senderId: dto.last_message?.sender_id ?? "",
            createdAt: timeFormatted,
            isUnread: dto.last_message?.is_unread ?? false,
        },
        unreadCount: dto.unread_count ?? 0,
        updatedAt: dto.updated_at || dto.created_at,
    };
}
