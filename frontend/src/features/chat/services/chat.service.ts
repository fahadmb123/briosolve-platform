import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";

export interface BackendMessageDto {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    message_type: "TEXT" | "IMAGE" | "FILE";
    created_at: string;
    updated_at: string | null;
}

export interface BackendParticipantDto {
    id: string;
    name: string;
    role: "CUSTOMER" | "PROVIDER";
    avatar?: string | null;
    business_name?: string | null;
    phone?: string | null;
    is_verified?: boolean;
    is_online?: boolean;
}

export interface BackendLastMessageDto {
    text: string;
    sender_id: string;
    created_at: string;
    is_unread: boolean;
}

export interface BackendLinkedRequestDto {
    id: string;
    title: string;
    category_name: string;
    subservice_name?: string | null;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    budget_type: "FIXED" | "OPEN_BID";
    budget_amount?: number | null;
    status: "PENDING" | "ACTIVE" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
    location?: string | null;
    scheduled_time?: string | null;
}

export interface BackendConversationDto {
    id: string;
    status: string;
    created_at: string;
    updated_at: string;
    participant?: BackendParticipantDto;
    last_message?: BackendLastMessageDto;
    unread_count?: number;
    linked_request?: BackendLinkedRequestDto | null;
}

export interface SendMessagePayload {
    content: string;
    messageType?: "TEXT" | "IMAGE" | "FILE";
}

export const getConversations = async (): Promise<response<BackendConversationDto[]>> => {
    const res = await apiClient.get("/api/chat/conversations");
    return res.data;
};

export const startConversation = async (recipientId: string): Promise<response<BackendConversationDto>> => {
    const res = await apiClient.post("/api/chat/conversations", {
        recipientId
    });
    return res.data;
};

export const getMessages = async (conversationId: string, cursor?: string, limit?: number): Promise<response<BackendMessageDto[]>> => {
    const res = await apiClient.get(
        `/api/chat/conversations/${conversationId}/messages`,
        {
            params: { cursor, limit }
        }
    );
    return res.data;
};

export const sendMessage = async (conversationId: string, payload: SendMessagePayload): Promise<response<BackendMessageDto>> => {
    const res = await apiClient.post(
        `/api/chat/conversations/${conversationId}/messages`,
        payload
    );
    return res.data;
};

export const markMessagesAsRead = async (conversationId: string): Promise<response<void>> => {
    const res = await apiClient.patch(`/api/chat/conversations/${conversationId}/read`);
    return res.data;
};

