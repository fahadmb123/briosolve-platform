import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { UpdateTicketStatusRequestDto } from "../dtos/request/update-ticket-status.dto";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class UpdateTicketStatusUseCase implements IUseCase<UpdateTicketStatusRequestDto, TicketResponseDto> {
  constructor(
    private readonly _supportTicketRepo: ISupportTicketRepository,
    private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
  ) {}

  async execute(input: UpdateTicketStatusRequestDto): Promise<TicketResponseDto> {
    const existing = await this._supportTicketRepo.findById(input.ticketId);
    if (!existing) {
      throw new ApplicationError("SUPPORT_TICKET_NOT_FOUND", "Support ticket not found", "NOT_FOUND");
    }

    const updated = await this._supportTicketRepo.updateTicketStatus(input.ticketId, {
      status: input.status,
      resolutionNote: input.resolutionNote,
      assignedTo: input.adminId
    });

    if (!updated) {
      throw new ApplicationError("SUPPORT_TICKET_UPDATE_FAILED", "Failed to update support ticket", "INTERNAL");
    }

    if (existing.creatorId && this._createNotificationUseCase) {
      let type = "INFO";
      let title = `Support Ticket Updated: #${existing.ticketNumber}`;
      let message = `Your support ticket #${existing.ticketNumber} status has been updated to ${input.status.replace("_", " ")}.`;

      if (input.status === "RESOLVED") {
        type = "SUCCESS";
        title = `Support Ticket Resolved: #${existing.ticketNumber}`;
        message = input.resolutionNote
          ? `Your ticket #${existing.ticketNumber} was resolved: ${input.resolutionNote}`
          : `Your support ticket #${existing.ticketNumber} has been resolved by our support team.`;
      } else if (input.status === "CLOSED") {
        type = "INFO";
        title = `Support Ticket Closed: #${existing.ticketNumber}`;
        message = input.resolutionNote
          ? `Your ticket #${existing.ticketNumber} was closed: ${input.resolutionNote}`
          : `Your support ticket #${existing.ticketNumber} has been closed.`;
      } else if (input.status === "UNDER_REVIEW") {
        type = "INFO";
        title = `Support Ticket Under Review: #${existing.ticketNumber}`;
        message = `Our support team is now actively reviewing ticket #${existing.ticketNumber}.`;
      }

      await this._createNotificationUseCase
        .execute({
          recipientId: existing.creatorId,
          type,
          title_code: `TICKET_${input.status}`,
          title,
          message
        })
        .catch(() => null);
    }

    return SupportTicketMapper.toDto(updated);
  }
}
