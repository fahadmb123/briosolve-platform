import { dashboardRepository } from "./repositories";
import { GetCustomerDashboardUseCase } from "../../application/use-cases/getCustomerDashboard.useCase";
import { GetProviderDashboardUseCase } from "../../application/use-cases/getProviderDashboard.useCase";
import { GetAdminDashboardUseCase } from "../../application/use-cases/getAdminDashboard.useCase";
import { GetAdminAuditLogsUseCase } from "../../application/use-cases/getAdminAuditLogs.useCase";

export const getCustomerDashboardUseCase = new GetCustomerDashboardUseCase(dashboardRepository);
export const getProviderDashboardUseCase = new GetProviderDashboardUseCase(dashboardRepository);
export const getAdminDashboardUseCase = new GetAdminDashboardUseCase(dashboardRepository);
export const getAdminAuditLogsUseCase = new GetAdminAuditLogsUseCase(dashboardRepository);
