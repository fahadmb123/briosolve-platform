export type TicketStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TicketCreatorRole = "CUSTOMER" | "PROVIDER";

export interface SupportTicketMessageEntity {
  id: string;
  ticketId: string;
  authorId?: string | null;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: Date;
}

export interface SupportTicketEntity {
  id: string;
  ticketNumber: string;
  creatorId: string;
  creatorRole: TicketCreatorRole;
  targetType: string;
  targetId?: string | null;
  targetNumber?: string | null;
  category: string;
  categoryLabel: string;
  subject: string;
  description: string;
  metadata?: Record<string, any> | null;
  priority: TicketPriority;
  status: TicketStatus;
  resolutionNote?: string | null;
  settlementDecision?: string | null;
  settlementDetails?: string | null;
  assignedTo?: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages?: SupportTicketMessageEntity[];
}
