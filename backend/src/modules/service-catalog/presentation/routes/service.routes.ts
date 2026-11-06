import { Router } from "express";
import { upload } from "../../../../shared/utils/multer";
import validate from "../../../../shared/middlewares/validate-request";
import { createServiceSchema } from "../schemas/create-service.schema";
import { authMiddleware } from "../../../../shared/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/middlewares/role.middleware";
import { ServiceRouteDependencies } from "../types/service.route.dependencies";

export function buildServiceRoute(controller:ServiceRouteDependencies):Router{
    const router = Router()

    router.get("/", authMiddleware, requireRole(["ADMIN", "PROVIDER", "CUSTOMER"]), controller.service.getServices)
    router.post("/", authMiddleware, requireRole(["ADMIN"]), upload.single('image'), validate(createServiceSchema), controller.service.addService)
    router.patch("/:id", authMiddleware, requireRole(["ADMIN"]), upload.single('image'), validate(createServiceSchema), controller.service.updateService)
    router.delete("/:id", authMiddleware, requireRole(["ADMIN"]), controller.service.deleteService)

    return router
}