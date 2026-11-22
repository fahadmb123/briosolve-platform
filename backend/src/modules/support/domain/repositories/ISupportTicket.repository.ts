import { SupportTicketEntity, SupportTicketMessageEntity } from "../entities/support-ticket.entity";

export interface CreateTicketParams {
  creatorId: string;
  creatorRole: "CUSTOMER" | "PROVIDER";
  targetType: string;
  targetId?: string | null;
  targetNumber?: string | null;
  category: string;
  categoryLabel: string;
  subject: string;
  description: string;
  metadata?: Record<string, any> | null;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}

export interface ISupportTicketRepository {
  createTicket(params: CreateTicketParams, initialMessageAuthorName: string): Promise<SupportTicketEntity>;
  findById(id: string): Promise<SupportTicketEntity | null>;
  findByCreatorId(creatorId: string): Promise<SupportTicketEntity[]>;
  getAll(status?: string): Promise<SupportTicketEntity[]>;
  addMessage(ticketId: string, authorId: string | null, authorName: string, authorRole: string, message: string): Promise<SupportTicketMessageEntity>;
}
