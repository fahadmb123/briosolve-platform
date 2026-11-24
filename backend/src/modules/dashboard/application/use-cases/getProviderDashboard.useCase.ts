import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IDashboardRepository } from "../../domain/repositories/IDashboard.repository";
import { GetProviderDashboardInputDto, ProviderDashboardResponseDto } from "../dtos/provider-dashboard.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class GetProviderDashboardUseCase implements IUseCase<GetProviderDashboardInputDto, ProviderDashboardResponseDto> {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async execute(input: GetProviderDashboardInputDto): Promise<ProviderDashboardResponseDto> {
    if (!input.userId) {
      throw new ApplicationError("USER_ID_REQUIRED", "User ID is required to fetch provider dashboard", "VALIDATION");
    }
    return this._dashboardRepository.getProviderDashboardData(input.userId);
  }
}
