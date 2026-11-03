import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { createServiceRequestSchema } from "../schemas/create-service-request.schema";
import { ServiceRequestRouteDependencies } from "../types/serviceRequest.route.dependencies";

export function buildServiceRequestRoute(controller: ServiceRequestRouteDependencies): Router {
    const router = Router();

    router.get("/", authMiddleware, requireRole(["CUSTOMER"]), controller.serviceRequest.getMyServiceRequests);
    router.post("/", authMiddleware, requireRole(["CUSTOMER"]), validate(createServiceRequestSchema), controller.serviceRequest.createServiceRequest)
    router.patch("/:id/cancel", authMiddleware, requireRole(["CUSTOMER"]), controller.serviceRequest.cancelServiceRequest);

    return router;
}
