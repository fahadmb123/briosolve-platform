import { Router } from "express";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import validate from "../../../../shared/middlewares/validate-request";
import { createServiceRequestSchema } from "../schemas/create-service-request.schema";
import { updateServiceRequestSchema } from "../schemas/update-service-request.schema";
import { ServiceRequestRouteDependencies } from "../types/serviceRequest.route.dependencies";

export function buildServiceRequestRoute(controller: ServiceRequestRouteDependencies): Router {
    const router = Router();

    router.get("/", authMiddleware, requireRole(["CUSTOMER"]), controller.serviceRequest.getMyServiceRequests);
    router.get("/provider", authMiddleware, requireRole(["PROVIDER"]), controller.serviceRequest.getProviderServiceRequests);
    router.post("/", authMiddleware, requireRole(["CUSTOMER"]), validate(createServiceRequestSchema), controller.serviceRequest.createServiceRequest);
    router.put("/:id", authMiddleware, requireRole(["CUSTOMER"]), validate(updateServiceRequestSchema), controller.serviceRequest.updateServiceRequest);
    router.patch("/:id/cancel", authMiddleware, requireRole(["CUSTOMER"]), controller.serviceRequest.cancelServiceRequest);

    return router;
}
