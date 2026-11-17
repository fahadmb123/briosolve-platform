import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { PaymentRouteDependencies } from "../types/payment.route.dependencies";

export function buildPaymentRoute(controller: PaymentRouteDependencies): Router {
    const router = Router();

    router.post("/create-order", authMiddleware, requireRole(["CUSTOMER"]), controller.payment.createOrder);
    router.post("/verify-and-accept", authMiddleware, requireRole(["CUSTOMER"]), controller.payment.verifyAndAccept);

    return router;
}
