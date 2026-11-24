import { dashboardRepository } from "./repositories";
import { GetCustomerDashboardUseCase } from "../../application/use-cases/getCustomerDashboard.useCase";
import { GetProviderDashboardUseCase } from "../../application/use-cases/getProviderDashboard.useCase";
import { GetAdminDashboardUseCase } from "../../application/use-cases/getAdminDashboard.useCase";

export function createGetCustomerDashboardUseCase(): GetCustomerDashboardUseCase {
  return new GetCustomerDashboardUseCase(dashboardRepository);
}

export function createGetProviderDashboardUseCase(): GetProviderDashboardUseCase {
  return new GetProviderDashboardUseCase(dashboardRepository);
}

export function createGetAdminDashboardUseCase(): GetAdminDashboardUseCase {
  return new GetAdminDashboardUseCase(dashboardRepository);
}
