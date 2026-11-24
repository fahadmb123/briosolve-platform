import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IDashboardRepository } from "../../domain/repositories/IDashboard.repository";
import { GetCustomerDashboardInputDto } from "../dtos/request/get-customer-dashboard.dto";
import { CustomerDashboardResponseDto } from "../dtos/response/customer-dashboard-response.dto";
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
