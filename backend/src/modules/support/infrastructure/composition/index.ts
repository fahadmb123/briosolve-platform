import { Router } from "express";
import { createSupportTicketRepository } from "./repositories";
import { createTicketUseCase, createGetMyTicketsUseCase } from "./useCases";
import { createSupportController } from "./controller";
import { buildSupportRoute } from "../../presentation/routes/support.routes";

export function createSupportRoutes(): Router {
  const repository = createSupportTicketRepository();
  const createTicketUC = createTicketUseCase(repository);
  const getMyTicketsUC = createGetMyTicketsUseCase(repository);
  const controller = createSupportController(createTicketUC, getMyTicketsUC);

  return buildSupportRoute({ support: controller });
}
