import { TicketStatus } from "../../../domain/entities/support-ticket.entity";

export interface UpdateTicketStatusRequestDto {
  ticketId: string;
  status: TicketStatus;
  resolutionNote?: string | null;
  adminId?: string;
}
