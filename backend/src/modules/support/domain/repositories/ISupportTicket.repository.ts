import { SupportTicket, SupportTicketMessage } from "../entities/support-ticket.entity";
import { CreateTicketInputDto } from "../../application/dtos/request/create-ticket.dto";

export interface GetUserTicketsParams {
  userId: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserTicketsResult {
  tickets: SupportTicket[];
  total: number;
  counts: {
    all: number;
    active: number;
    resolved: number;
  };
}

export interface GetAdminTicketsParams {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AdminTicketsResult {
  tickets: SupportTicket[];
  total: number;
  openCount: number;
}

export interface ISupportTicketRepository {
  createTicket(input: CreateTicketInputDto): Promise<SupportTicket>;
  findById(id: string): Promise<SupportTicket | null>;
  findByCreatorId(params: GetUserTicketsParams): Promise<UserTicketsResult>;
  findAdminTickets(params: GetAdminTicketsParams): Promise<AdminTicketsResult>;
  getAll(status?: string): Promise<SupportTicket[]>;
  addMessage(ticketId: string, authorId: string | null, authorName: string, authorRole: string, message: string): Promise<SupportTicketMessage>;
}
