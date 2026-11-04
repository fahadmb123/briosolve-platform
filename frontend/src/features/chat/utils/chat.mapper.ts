import type { BackendMessageDto } from "../services/chat.service";
import type { ChatMessage } from "../types/chat.types";

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

