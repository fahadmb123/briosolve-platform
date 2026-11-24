import { useQuery } from "@tanstack/react-query";
import type {
  CustomerDashboardData,
  ProviderDashboardData,
  AdminDashboardData,
  AdminAuditLogsResponse,
  AdminAnalyticsResponse,
} from "../services/dashboard.service";
import { dashboardService } from "../services/dashboard.service";

export function useCustomerDashboard() {
  return useQuery<CustomerDashboardData>({
    queryKey: ["dashboard", "customer"],
    queryFn: () => dashboardService.getCustomerDashboard(),
    staleTime: 30000,
  });
}

export function useProviderDashboard() {
  return useQuery<ProviderDashboardData>({
    queryKey: ["dashboard", "provider"],
    queryFn: () => dashboardService.getProviderDashboard(),
    staleTime: 30000,
  });
}

export function useAdminDashboard() {
  return useQuery<AdminDashboardData>({
    queryKey: ["dashboard", "admin"],
    queryFn: () => dashboardService.getAdminDashboard(),
    staleTime: 30000,
  });
}

export function useAdminAuditLogs(params?: {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}) {
  return useQuery<AdminAuditLogsResponse>({
    queryKey: ["dashboard", "admin", "audit-logs", params],
    queryFn: () => dashboardService.getAdminAuditLogs(params),
    staleTime: 15000,
  });
}

export function useAdminAnalytics(timeframe?: string) {
  return useQuery<AdminAnalyticsResponse>({
    queryKey: ["dashboard", "admin", "analytics", timeframe],
    queryFn: () => dashboardService.getAdminAnalytics(timeframe),
    staleTime: 30000,
  });
}
