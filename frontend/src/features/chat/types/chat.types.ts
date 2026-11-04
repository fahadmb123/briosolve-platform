export type MessageSenderRole = "CUSTOMER" | "PROVIDER" | "SYSTEM";

export type MessageStatus = "SENDING" | "SENT" | "DELIVERED" | "READ";

export type MessageType = "TEXT" | "QUOTE" | "IMAGE" | "ACTION_CARD";

export interface ChatQuotePayload {
  quoteId: string;
  requestId: string;
  requestTitle: string;
  amount: number;
  durationHours?: number;
  includesParts: boolean;
  notes?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: MessageSenderRole;
  senderName: string;
  senderAvatar?: string;
  text: string;
  type: MessageType;
  quotePayload?: ChatQuotePayload;
  imageUrl?: string;
  status: MessageStatus;
  createdAt: string;
}

export interface ChatLinkedRequest {
  id: string;
  title: string;
  categoryName: string;
  subserviceName?: string;
  urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
  budgetType: "FIXED" | "OPEN_BID";
  budgetAmount?: number;
  status: "PENDING" | "ACTIVE" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  scheduledTime?: string;
  location: string;
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: "PROVIDER" | "CUSTOMER";
  avatar?: string;
  businessName?: string;
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  phone?: string;
}

export interface ChatConversation {
  id: string;
  participant: ChatParticipant;
  linkedRequest: ChatLinkedRequest;
  lastMessage: {
    text: string;
    senderId: string;
    createdAt: string;
    isUnread: boolean;
  };
  unreadCount: number;
  hasActiveQuote: boolean;
  updatedAt: string;
}

export type ConversationFilter = "ALL" | "UNREAD" | "QUOTES";

