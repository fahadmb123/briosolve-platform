import { DashboardController } from "../../presentation/controllers/dashboard.controller";
import {
  getCustomerDashboardUseCase,
  getProviderDashboardUseCase,
  getAdminDashboardUseCase,
  getAdminAuditLogsUseCase,
  getAdminAnalyticsUseCase,
} from "./useCases";

export const dashboardController = new DashboardController(
  getCustomerDashboardUseCase,
  getProviderDashboardUseCase,
  getAdminDashboardUseCase,
  getAdminAuditLogsUseCase,
  getAdminAnalyticsUseCase
);
