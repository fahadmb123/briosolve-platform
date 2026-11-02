import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { ServiceRequestRouteDependencies } from "../types/serviceRequest.route.dependencies";

export function buildServiceRequestRoute(controller: ServiceRequestRouteDependencies): Router {
    const router = Router();

    router.post("/", authMiddleware, requireRole(["CUSTOMER"]), controller.serviceRequest.createServiceRequest);

    return router;
}

