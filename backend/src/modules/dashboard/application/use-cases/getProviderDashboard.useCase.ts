import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IDashboardRepository } from "../../domain/repositories/IDashboard.repository";
import { GetProviderDashboardRequestDto } from "../dtos/request/get-provider-dashboard.dto";
import { ProviderDashboardResponseDto } from "../dtos/response/provider-dashboard-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class GetProviderDashboardUseCase implements IUseCase<GetProviderDashboardRequestDto, ProviderDashboardResponseDto> {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async execute(request: GetProviderDashboardRequestDto): Promise<ProviderDashboardResponseDto> {
    if (!request.userId) {
      throw new ApplicationError("USER_ID_REQUIRED", "User ID is required to fetch provider dashboard", "VALIDATION");
    }
    return this._dashboardRepository.getProviderDashboardData(request.userId);
  }
}
