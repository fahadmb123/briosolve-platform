import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { createTicketSchema } from "../schemas/create-ticket.schema";
import { SupportRouteDependencies } from "../types/support.route.dependencies";

export function buildSupportRoute(controller: SupportRouteDependencies): Router {
  const router = Router();

  router.post("/tickets", authMiddleware, validate(createTicketSchema), controller.support.createTicket);
  router.get("/tickets/my", authMiddleware, controller.support.getMyTickets);
  router.get("/tickets/admin", authMiddleware, requireRole(["ADMIN"]), controller.support.getAdminTickets);

  return router;
}
