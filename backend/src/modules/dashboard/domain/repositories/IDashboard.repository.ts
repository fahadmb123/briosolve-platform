import { CustomerDashboardResponseDto } from "../../application/dtos/response/customer-dashboard-response.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";

export interface AdminAuditLogEntry {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string;
  actor?: string;
  severity?: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  metadata?: Record<string, any>;
}

export interface AdminAuditLogsResponseDto {
  logs: AdminAuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IDashboardRepository {
  getCustomerDashboardData(userId: string): Promise<CustomerDashboardResponseDto>;
  getProviderDashboardData(userId: string): Promise<ProviderDashboardResponseDto>;
  getAdminDashboardData(): Promise<AdminDashboardResponseDto>;
  getAdminAuditLogs(params?: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
  }): Promise<AdminAuditLogsResponseDto>;
}
