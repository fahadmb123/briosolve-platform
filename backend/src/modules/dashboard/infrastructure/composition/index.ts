import { buildDashboardRoute } from "../../presentation/routes/dashboard.routes";
import { dashboardController } from "./controllers";

export const dashboardRoutes = buildDashboardRoute({
  dashboard: dashboardController,
});

export function createDashboardRoutes() {
  return dashboardRoutes;
}

export * from "./repositories";
export * from "./useCases";
export * from "./controllers";
