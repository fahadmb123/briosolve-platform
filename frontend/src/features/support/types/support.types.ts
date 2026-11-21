export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type TicketStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";

export type TicketCategory =
  | "PROVIDER_NO_SHOW"
  | "POOR_WORKMANSHIP"
  | "UNAUTHORIZED_CHARGES"
  | "SAFETY_CONDUCT"
  | "PAYMENT_REFUND"
  | "CUSTOMER_ABSENT"
  | "PAYMENT_DISPUTE"
  | "SCOPE_DISPUTE"
  | "SAFETY_PREMISES"
  | "GENERAL_INQUIRY";

export interface TicketMessage {
  id: string;
  authorName: string;
  authorRole: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SYSTEM";
  message: string;
  createdAt: string;
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  creatorId: string;
  creatorName: string;
  creatorRole: "CUSTOMER" | "PROVIDER";
  bookingId?: string;
  bookingNumber?: string;
  serviceTitle?: string;
  counterpartyName?: string;
  category: TicketCategory;
  categoryLabel: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  resolutionNote?: string;
  messages: TicketMessage[];
}

export interface CreateTicketPayload {
  bookingId?: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority?: TicketPriority;
  attachments?: string[];
}
