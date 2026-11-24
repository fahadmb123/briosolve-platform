import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { DashboardRouteDependencies } from "../types/dashboard-route-dependencies";

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
