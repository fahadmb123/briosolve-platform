import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { BookingRouteDependencies } from "../types/booking.route.dependencies";

export function buildBookingRoute(controller: BookingRouteDependencies): Router {
    const router = Router();

    router.get("/admin", authMiddleware, requireRole(["ADMIN"]), controller.booking.getAdminBookings);
    router.patch("/admin/:id/status", authMiddleware, requireRole(["ADMIN"]), controller.booking.adminUpdateStatus);
    router.get("/customer", authMiddleware, requireRole(["CUSTOMER"]), controller.booking.getCustomerBookings);
    router.get("/provider", authMiddleware, requireRole(["PROVIDER"]), controller.booking.getProviderBookings);
    router.get("/:id", authMiddleware, controller.booking.getById);
    router.patch("/:id/status", authMiddleware, requireRole(["PROVIDER", "CUSTOMER"]), controller.booking.updateStatus);
    router.post("/:id/mismatch-report", authMiddleware, requireRole(["PROVIDER"]), controller.booking.reportMismatch);
    router.post("/:id/mismatch-resolve", authMiddleware, requireRole(["CUSTOMER"]), controller.booking.resolveMismatch);
    router.post("/:id/warranty-claim", authMiddleware, requireRole(["CUSTOMER"]), controller.booking.submitWarrantyClaim);
    router.post("/:id/warranty-resolve", authMiddleware, requireRole(["PROVIDER"]), controller.booking.resolveWarrantyClaim);

    return router;
}
