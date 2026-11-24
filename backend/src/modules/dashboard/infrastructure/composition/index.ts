import { buildDashboardRoute } from "../../presentation/routes/dashboard.routes";
import { createDashboardController } from "./controller";

export function createDashboardRoutes() {
  const dashboardController = createDashboardController();
  return buildDashboardRoute({
    dashboard: dashboardController,
  });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
