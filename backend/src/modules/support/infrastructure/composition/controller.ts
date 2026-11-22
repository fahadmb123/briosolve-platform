import { SupportController } from "../../presentation/controllers/support.controller";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";
import { GetAdminTicketsUseCase } from "../../application/use-cases/getAdminTickets.useCase";

export function createSupportController(
  createTicketUC: CreateTicketUseCase,
  getMyTicketsUC: GetMyTicketsUseCase,
  getAdminTicketsUC: GetAdminTicketsUseCase
): SupportController {
  return new SupportController(createTicketUC, getMyTicketsUC, getAdminTicketsUC);
}
