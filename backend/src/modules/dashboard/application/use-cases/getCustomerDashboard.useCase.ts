import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IDashboardRepository } from "../../domain/repositories/IDashboard.repository";
import { GetCustomerDashboardInputDto, CustomerDashboardResponseDto } from "../dtos/customer-dashboard.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class GetCustomerDashboardUseCase implements IUseCase<GetCustomerDashboardInputDto, CustomerDashboardResponseDto> {
  constructor(private readonly _dashboardRepository: IDashboardRepository) {}

  async execute(input: GetCustomerDashboardInputDto): Promise<CustomerDashboardResponseDto> {
    if (!input.userId) {
      throw new ApplicationError("USER_ID_REQUIRED", "User ID is required to fetch customer dashboard", "VALIDATION");
    }
    return this._dashboardRepository.getCustomerDashboardData(input.userId);
  }
}
