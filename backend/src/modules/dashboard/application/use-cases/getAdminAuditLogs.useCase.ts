import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { AdminAuditLogsResponseDto, IDashboardRepository } from "../../domain/repositories/IDashboard.repository";

export interface GetAdminAuditLogsInputDto {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export class GetAdminAuditLogsUseCase implements IUseCase<GetAdminAuditLogsInputDto, AdminAuditLogsResponseDto> {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async execute(input?: GetAdminAuditLogsInputDto): Promise<AdminAuditLogsResponseDto> {
    return this._dashboardRepository.getAdminAuditLogs(input);
  }
}
