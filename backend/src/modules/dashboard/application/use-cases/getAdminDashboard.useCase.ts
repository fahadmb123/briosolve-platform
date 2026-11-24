import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IDashboardRepository } from "../../domain/repositories/IDashboard.repository";
import { AdminDashboardResponseDto } from "../dtos/admin-dashboard.dto";

export class GetAdminDashboardUseCase implements IUseCase<void, AdminDashboardResponseDto> {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async execute(): Promise<AdminDashboardResponseDto> {
    return this._dashboardRepository.getAdminDashboardData();
  }
}
