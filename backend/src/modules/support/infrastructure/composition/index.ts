import { Router } from "express";
import { createSupportTicketRepository } from "./repositories";
import {
  createTicketUseCase,
  createGetMyTicketsUseCase,
  createGetAdminTicketsUseCase,
  createUpdateTicketStatusUseCase
} from "./useCases";
import { createSupportController } from "./controller";
import { buildSupportRoute } from "../../presentation/routes/support.routes";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createSupportRoutes(
  createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): Router {
  const repository = createSupportTicketRepository();
  const createTicketUC = createTicketUseCase(repository);
  const getMyTicketsUC = createGetMyTicketsUseCase(repository);
  const getAdminTicketsUC = createGetAdminTicketsUseCase(repository);
  const updateTicketStatusUC = createUpdateTicketStatusUseCase(repository, createNotificationUseCase);
  const controller = createSupportController(
    createTicketUC,
    getMyTicketsUC,
    getAdminTicketsUC,
    updateTicketStatusUC
  );

  return buildSupportRoute({ support: controller });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
