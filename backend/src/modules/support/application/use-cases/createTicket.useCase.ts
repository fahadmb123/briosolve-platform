import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketRequestDto } from "../dtos/request/create-ticket.dto";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export class CreateTicketUseCase implements IUseCase<CreateTicketRequestDto, TicketResponseDto> {
  constructor(private readonly _ticketRepository: ISupportTicketRepository) {}

  async execute(input: CreateTicketRequestDto): Promise<TicketResponseDto> {
    if (!input.description || !input.description.trim()) {
      throw new ApplicationError("MISSING_DESCRIPTION", "Ticket description is required", "VALIDATION");
    }
    if (!input.subject || !input.subject.trim()) {
      throw new ApplicationError("MISSING_SUBJECT", "Ticket subject is required", "VALIDATION");
    }

    const createdTicket = await this._ticketRepository.createTicket(input);
    return SupportTicketMapper.toDto(createdTicket);
  }
}
