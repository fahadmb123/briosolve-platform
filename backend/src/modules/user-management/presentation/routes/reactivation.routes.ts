import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { ReactivationRouteDependencies } from "../types/reactivation.route.dependencies";

export function buildReactivationRoute(controller: ReactivationRouteDependencies): Router {
    const router = Router();

    router.get("/", authMiddleware, requireRole(["ADMIN"]), controller.reactivation.getReactivations);
    router.post("/send-otp", controller.reactivation.sendOtp);
    router.post("/request", controller.reactivation.requestReactivation);

    return router;
}
