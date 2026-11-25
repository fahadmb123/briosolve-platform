import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";
import { AdminAuditLogEntry, AdminAuditLogsResponseDto } from "../../application/dtos/response/admin-audit-logs-response.dto";
import { AdminAnalyticsResponseDto } from "../../application/dtos/response/admin-analytics-response.dto";
import { GetAdminAuditLogsRequestDto } from "../../application/dtos/request/get-admin-audit-logs.dto";

export { AdminAuditLogEntry, AdminAuditLogsResponseDto, AdminAnalyticsResponseDto };

export interface RawAuditLogSources {
  bookings: any[];
  requests: any[];
  quotations: any[];
  tickets: any[];
  profiles: any[];
  notifications: any[];
  customers: any[];
}

export interface RawAnalyticsSources {
  users: any[];
  providerProfiles: any[];
  requests: any[];
  quotations: any[];
  bookings: any[];
  categories: any[];
  addresses: any[];
  tickets: any[];
}

export interface IDashboardRepository {
  getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto>;
  getAdminDashboardData(): Promise<AdminDashboardResponseDto>;
  getRawAuditLogSources(): Promise<RawAuditLogSources>;
  getRawAnalyticsSources(): Promise<RawAnalyticsSources>;
  getAdminAuditLogs?(params?: GetAdminAuditLogsRequestDto): Promise<AdminAuditLogsResponseDto>;
}
