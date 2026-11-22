import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { CreateTicketInputDto } from "../dtos/request/create-ticket.dto";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export class CreateTicketUseCase implements IUseCase<CreateTicketInputDto, TicketResponseDto> {
  constructor(private readonly _ticketRepository: ISupportTicketRepository) {}

  async execute(input: CreateTicketInputDto): Promise<TicketResponseDto> {
    if (!input.description || !input.description.trim()) {
      throw new ApplicationError("MISSING_DESCRIPTION", "Ticket description is required", "VALIDATION");
    }
    if (!input.subject || !input.subject.trim()) {
      throw new ApplicationError("MISSING_SUBJECT", "Ticket subject is required", "VALIDATION");
    }

    const created = await this._ticketRepository.createTicket({
      creatorId: input.creatorId,
      creatorRole: input.creatorRole,
      targetType: input.targetType || "GENERAL",
      targetId: input.targetId ?? null,
      targetNumber: input.targetNumber ?? null,
      category: input.category,
      categoryLabel: input.categoryLabel,
      subject: input.subject.trim(),
      description: input.description.trim(),
      metadata: input.metadata ?? null,
      priority: input.priority ?? "HIGH"
    }, input.authorName);

    return SupportTicketMapper.toResponseDto(created);
  }
}
