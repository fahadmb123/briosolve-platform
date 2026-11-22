export interface CreateTicketRequestDto {
  creatorId: string;
  creatorRole: "CUSTOMER" | "PROVIDER";
  targetType?: string;
  targetId?: string;
  targetNumber?: string;
  category: string;
  categoryLabel: string;
  subject: string;
  description: string;
  metadata?: Record<string, any>;
  authorName: string;
}
