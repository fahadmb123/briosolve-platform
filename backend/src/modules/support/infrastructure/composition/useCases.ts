import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";
import { GetAdminTicketsUseCase } from "../../application/use-cases/getAdminTickets.useCase";
import { UpdateTicketStatusUseCase } from "../../application/use-cases/updateTicketStatus.useCase";

export function createTicketUseCase(repo: ISupportTicketRepository): CreateTicketUseCase {
  return new CreateTicketUseCase(repo);
}

export function createGetMyTicketsUseCase(repo: ISupportTicketRepository): GetMyTicketsUseCase {
  return new GetMyTicketsUseCase(repo);
}

export function createGetAdminTicketsUseCase(repo: ISupportTicketRepository): GetAdminTicketsUseCase {
  return new GetAdminTicketsUseCase(repo);
}

export function createUpdateTicketStatusUseCase(repo: ISupportTicketRepository): UpdateTicketStatusUseCase {
  return new UpdateTicketStatusUseCase(repo);
}
