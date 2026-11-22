import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";

export function createTicketUseCase(repo: ISupportTicketRepository): CreateTicketUseCase {
  return new CreateTicketUseCase(repo);
}

export function createGetMyTicketsUseCase(repo: ISupportTicketRepository): GetMyTicketsUseCase {
  return new GetMyTicketsUseCase(repo);
}
