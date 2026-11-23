import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";

export function createDashboardRoutes(controller = new DashboardController()): Router {
  const router = Router();

  router.get("/customer", authMiddleware, requireRole(["CUSTOMER"]), (req, res) => controller.getCustomerDashboard(req, res));
  router.get("/provider", authMiddleware, requireRole(["PROVIDER"]), (req, res) => controller.getProviderDashboard(req, res));
  router.get("/admin", authMiddleware, requireRole(["ADMIN"]), (req, res) => controller.getAdminDashboard(req, res));

  return router;
}
