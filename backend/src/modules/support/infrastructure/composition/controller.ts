import { SupportController } from "../../presentation/controllers/support.controller";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";
import { GetAdminTicketsUseCase } from "../../application/use-cases/getAdminTickets.useCase";
import { UpdateTicketStatusUseCase } from "../../application/use-cases/updateTicketStatus.useCase";

export function createSupportController(
  createTicketUC: CreateTicketUseCase,
  getMyTicketsUC: GetMyTicketsUseCase,
  getAdminTicketsUC: GetAdminTicketsUseCase,
  updateTicketStatusUC: UpdateTicketStatusUseCase
): SupportController {
  return new SupportController(createTicketUC, getMyTicketsUC, getAdminTicketsUC, updateTicketStatusUC);
}
