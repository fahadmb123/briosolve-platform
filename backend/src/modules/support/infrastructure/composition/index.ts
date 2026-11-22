import { Router } from "express";
import { createSupportTicketRepository } from "./repositories";
import { createTicketUseCase, createGetMyTicketsUseCase, createGetAdminTicketsUseCase } from "./useCases";
import { createSupportController } from "./controller";
import { buildSupportRoute } from "../../presentation/routes/support.routes";

export function createSupportRoutes(): Router {
  const repository = createSupportTicketRepository();
  const createTicketUC = createTicketUseCase(repository);
  const getMyTicketsUC = createGetMyTicketsUseCase(repository);
  const getAdminTicketsUC = createGetAdminTicketsUseCase(repository);
  const controller = createSupportController(createTicketUC, getMyTicketsUC, getAdminTicketsUC);

  return buildSupportRoute({ support: controller });
}
