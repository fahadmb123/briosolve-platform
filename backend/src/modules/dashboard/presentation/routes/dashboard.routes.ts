import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { DashboardRouteDependencies } from "../types/dashboard.route.dependencies";
import { DashboardController } from "../controllers/dashboard.controller";
import { createDashboardController } from "../../infrastructure/composition/controller";

export function buildDashboardRoute(dependencies: DashboardRouteDependencies): Router {
  const router = Router();

  router.get(
    "/customer",
    authMiddleware,
    requireRole(["CUSTOMER"]),
    dependencies.dashboard.getCustomerDashboard
  );

  router.get(
    "/provider",
    authMiddleware,
    requireRole(["PROVIDER"]),
    dependencies.dashboard.getProviderDashboard
  );

  router.get(
    "/admin",
    authMiddleware,
    requireRole(["ADMIN"]),
    dependencies.dashboard.getAdminDashboard
  );

  return router;
}

export function createDashboardRoutes(controller?: DashboardController): Router {
  const resolvedController = controller || createDashboardController();
  return buildDashboardRoute({ dashboard: resolvedController });
}
