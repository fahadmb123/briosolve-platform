export interface ParticipantResponseDto {
    id: string;
    name: string;
    role: "CUSTOMER" | "PROVIDER";
    avatar?: string | null;
    business_name?: string | null;
    phone?: string | null;
    is_verified?: boolean;
    is_online?: boolean;
}

export interface LastMessageResponseDto {
    text: string;
    sender_id: string;
    created_at: Date;
    is_unread: boolean;
}

export interface LinkedRequestResponseDto {
    id: string;
    title: string;
    category_name: string;
    subservice_name?: string | null;
    urgency: string;
    budget_type: string;
    budget_amount?: number | null;
    status: string;
    location?: string | null;
    scheduled_time?: string | null;
}

export interface ConversationResponseDto {
    id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
    participant?: ParticipantResponseDto;
    last_message?: LastMessageResponseDto;
    unread_count?: number;
    linked_request?: LinkedRequestResponseDto | null;
}

