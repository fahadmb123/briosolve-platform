import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketUseCase } from "../../application/use-cases/createTicket.useCase";
import { GetMyTicketsUseCase } from "../../application/use-cases/getMyTickets.useCase";
import { GetAdminTicketsUseCase } from "../../application/use-cases/getAdminTickets.useCase";
import { UpdateTicketStatusUseCase } from "../../application/use-cases/updateTicketStatus.useCase";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createTicketUseCase(repo: ISupportTicketRepository): CreateTicketUseCase {
  return new CreateTicketUseCase(repo);
}

export function createGetMyTicketsUseCase(repo: ISupportTicketRepository): GetMyTicketsUseCase {
  return new GetMyTicketsUseCase(repo);
}

export function createGetAdminTicketsUseCase(repo: ISupportTicketRepository): GetAdminTicketsUseCase {
  return new GetAdminTicketsUseCase(repo);
}

export function createUpdateTicketStatusUseCase(
  repo: ISupportTicketRepository,
  createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): UpdateTicketStatusUseCase {
  return new UpdateTicketStatusUseCase(repo, createNotificationUseCase);
}
