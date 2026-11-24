import { CustomerDashboardResponseDto } from "../../application/dtos/response/customer-dashboard-response.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";
import { AdminAuditLogEntry, AdminAuditLogsResponseDto } from "../../application/dtos/response/admin-audit-logs-response.dto";
import { GetAdminAuditLogsRequestDto } from "../../application/dtos/request/get-admin-audit-logs.dto";

export { AdminAuditLogEntry, AdminAuditLogsResponseDto };

export interface RawAuditLogSources {
  bookings: any[];
  requests: any[];
  quotations: any[];
  tickets: any[];
  profiles: any[];
  notifications: any[];
  customers: any[];
}

export interface IDashboardRepository {
  getCustomerDashboardData(userId: string): Promise<CustomerDashboardResponseDto>;
  getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto>;
  getAdminDashboardData(): Promise<AdminDashboardResponseDto>;
  getRawAuditLogSources(): Promise<RawAuditLogSources>;
  getAdminAuditLogs?(params?: GetAdminAuditLogsRequestDto): Promise<AdminAuditLogsResponseDto>;
}
