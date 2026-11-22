import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { UpdateTicketStatusRequestDto } from "../dtos/request/update-ticket-status.dto";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export class UpdateTicketStatusUseCase implements IUseCase<UpdateTicketStatusRequestDto, TicketResponseDto> {
  constructor(private readonly _supportTicketRepo: ISupportTicketRepository) {}

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

    return SupportTicketMapper.toDto(updated);
  }
}
