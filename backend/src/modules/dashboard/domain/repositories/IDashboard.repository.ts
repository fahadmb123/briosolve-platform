import { CustomerDashboardResponseDto } from "../../application/dtos/response/customer-dashboard-response.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";

export interface IDashboardRepository {
  getCustomerDashboardData(userId: string): Promise<CustomerDashboardResponseDto>;
  getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto>;
  getAdminDashboardData(): Promise<AdminDashboardResponseDto>;
}
