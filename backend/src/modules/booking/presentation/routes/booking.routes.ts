import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { BookingRouteDependencies } from "../types/booking.route.dependencies";

export function buildBookingRoute(controller: BookingRouteDependencies): Router {
    const router = Router();

    router.get("/:id", authMiddleware, controller.booking.getById);
    router.get("/customer", authMiddleware, requireRole(["CUSTOMER"]), controller.booking.getCustomerBookings);
    router.get("/provider", authMiddleware, requireRole(["PROVIDER"]), controller.booking.getProviderBookings);
    router.patch("/:id/status", authMiddleware, requireRole(["PROVIDER", "CUSTOMER"]), controller.booking.updateStatus);

    return router;
}
