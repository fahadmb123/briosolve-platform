import { DashboardController } from "../../presentation/controllers/dashboard.controller";
import {
  getProviderDashboardUseCase,
  getAdminDashboardUseCase,
  getAdminAuditLogsUseCase,
  getAdminAnalyticsUseCase,
} from "./useCases";

export const dashboardController = new DashboardController(
  getProviderDashboardUseCase,
  getAdminDashboardUseCase,
  getAdminAuditLogsUseCase,
  getAdminAnalyticsUseCase
);
