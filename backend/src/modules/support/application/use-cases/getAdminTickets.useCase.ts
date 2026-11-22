import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ISupportTicketRepository, GetAdminTicketsParams } from "../../domain/repositories/ISupportTicket.repository";
import { TicketResponseDto } from "../dtos/response/ticket-response.dto";
import { SupportTicketMapper } from "../../infrastructure/mappers/support-ticket.mapper";

export interface GetAdminTicketsRequestDto extends GetAdminTicketsParams {}

export interface AdminTicketsResponseDto {
  tickets: TicketResponseDto[];
  total: number;
  openCount: number;
}

export class GetAdminTicketsUseCase implements IUseCase<GetAdminTicketsRequestDto, AdminTicketsResponseDto> {
  constructor(private readonly _ticketRepository: ISupportTicketRepository) {}

  async execute(input: GetAdminTicketsRequestDto): Promise<AdminTicketsResponseDto> {
    const result = await this._ticketRepository.findAdminTickets(input);
    return {
      tickets: result.tickets.map((t) => SupportTicketMapper.toDto(t)),
      total: result.total,
      openCount: result.openCount
    };
  }
}
