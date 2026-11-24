import { CustomerDashboardResponseDto } from "../../application/dtos/customer-dashboard.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/provider-dashboard.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/admin-dashboard.dto";

export interface IDashboardRepository {
  getCustomerDashboardData(userId: string): Promise<CustomerDashboardResponseDto>;
  getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto>;
  getAdminDashboardData(): Promise<AdminDashboardResponseDto>;
}
