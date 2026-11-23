import { useQuery } from "@tanstack/react-query";
import type {
  CustomerDashboardData,
  ProviderDashboardData,
  AdminDashboardData,
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
