import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { ProviderServiceDependencies } from "../types/providerService.route.dependencies";

export function buildProviderServiceRoute(controller:ProviderServiceDependencies):Router{
    const router = Router()

    router.get("/", authMiddleware, requireRole(["PROVIDER"]), controller.providerService.getProviderServices);
    router.post("/", authMiddleware, requireRole(["PROVIDER"]), controller.providerService.addProviderServices);
    router.delete("/:id", authMiddleware, requireRole(["PROVIDER"]), controller.providerService.deleteProviderService);
    router.delete("/category/:id", authMiddleware, requireRole(["PROVIDER"]), controller.providerService.deleteProviderCategory);

    return router
}