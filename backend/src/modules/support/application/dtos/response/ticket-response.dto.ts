export interface TicketMessageResponseDto {
  id: string;
  ticketId: string;
  authorId?: string | null;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface TicketResponseDto {
  id: string;
  ticketNumber: string;
  creatorId: string;
  creatorName?: string | null;
  creatorEmail?: string | null;
  creatorRole: "CUSTOMER" | "PROVIDER";
  targetType: string;
  targetId?: string | null;
  targetNumber?: string | null;
  bookingNumber?: string | null;
  serviceTitle?: string | null;
  category: string;
  categoryLabel: string;
  subject: string;
  description: string;
  metadata?: Record<string, any> | null;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";
  resolutionNote?: string | null;
  settlementDecision?: string | null;
  settlementDetails?: string | null;
  assignedTo?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessageResponseDto[];
}
