import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ISupportTicketRepository, GetUserTicketsParams } from "../../domain/repositories/ISupportTicket.repository";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export interface GetMyTicketsInputDto extends GetUserTicketsParams {}

export interface UserTicketsResponseDto {
  tickets: TicketResponseDto[];
  total: number;
  counts: {
    all: number;
    active: number;
    resolved: number;
  };
}

export class GetMyTicketsUseCase implements IUseCase<GetMyTicketsInputDto, UserTicketsResponseDto> {
  constructor(private readonly _ticketRepository: ISupportTicketRepository) {}

  async execute(input: GetMyTicketsInputDto): Promise<UserTicketsResponseDto> {
    const result = await this._ticketRepository.findByCreatorId(input);
    return {
      tickets: result.tickets.map((t) => SupportTicketMapper.toDto(t)),
      total: result.total,
      counts: result.counts
    };
  }
}
