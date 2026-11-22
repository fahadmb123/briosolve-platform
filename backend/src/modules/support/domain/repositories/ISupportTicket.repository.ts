import { SupportTicket, SupportTicketMessage } from "../entities/support-ticket.entity";
import { CreateTicketInputDto } from "../../application/dtos/request/create-ticket.dto";

export interface ISupportTicketRepository {
  createTicket(input: CreateTicketInputDto): Promise<SupportTicket>;
  findById(id: string): Promise<SupportTicket | null>;
  findByCreatorId(creatorId: string): Promise<SupportTicket[]>;
  getAll(status?: string): Promise<SupportTicket[]>;
  addMessage(ticketId: string, authorId: string | null, authorName: string, authorRole: string, message: string): Promise<SupportTicketMessage>;
}
