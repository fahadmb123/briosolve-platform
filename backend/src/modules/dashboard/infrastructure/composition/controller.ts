import { DashboardController } from "../../presentation/controllers/dashboard.controller";
import {
  createGetCustomerDashboardUseCase,
  createGetProviderDashboardUseCase,
  createGetAdminDashboardUseCase,
} from "./useCases";

export function createDashboardController(): DashboardController {
  const getCustomerDashboardUseCase = createGetCustomerDashboardUseCase();
  const getProviderDashboardUseCase = createGetProviderDashboardUseCase();
  const getAdminDashboardUseCase = createGetAdminDashboardUseCase();

  return new DashboardController(
    getCustomerDashboardUseCase,
    getProviderDashboardUseCase,
    getAdminDashboardUseCase
  );
}
