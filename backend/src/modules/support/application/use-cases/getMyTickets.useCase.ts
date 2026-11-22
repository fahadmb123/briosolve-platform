import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ISupportTicketRepository } from "../../domain/repositories/ISupportTicket.repository";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export interface GetMyTicketsInputDto {
  userId: string;
}

export class GetMyTicketsUseCase implements IUseCase<GetMyTicketsInputDto, TicketResponseDto[]> {
  constructor(private readonly _ticketRepository: ISupportTicketRepository) {}

  async execute(input: GetMyTicketsInputDto): Promise<TicketResponseDto[]> {
    const tickets = await this._ticketRepository.findByCreatorId(input.userId);
    return tickets.map((t) => SupportTicketMapper.toResponseDto(t));
  }
}
