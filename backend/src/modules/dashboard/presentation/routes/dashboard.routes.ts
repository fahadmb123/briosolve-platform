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

  router.get(
    "/admin/audit-logs",
    authMiddleware,
    requireRole(["ADMIN"]),
    dependencies.dashboard.getAdminAuditLogs
  );

  router.get(
    "/admin/analytics",
    authMiddleware,
    requireRole(["ADMIN"]),
    dependencies.dashboard.getAdminAnalytics
  );

  return router;
}
