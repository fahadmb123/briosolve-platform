import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { SupportRouteDependencies } from "../types/support.route.dependencies";

export function buildSupportRoute(controller: SupportRouteDependencies): Router {
  const router = Router();

  router.post("/tickets", authMiddleware, controller.support.createTicket);
  router.get("/tickets/my", authMiddleware, controller.support.getMyTickets);

  return router;
}
