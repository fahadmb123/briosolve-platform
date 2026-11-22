import { SupportController } from "../../presentation/controllers/support.controller";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";

export function createSupportController(
  createTicketUC: CreateTicketUseCase,
  getMyTicketsUC: GetMyTicketsUseCase
): SupportController {
  return new SupportController(createTicketUC, getMyTicketsUC);
}
