import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import { providerServiceController } from "../../infrastructure/composition/controller.js";

const route = Router();

route.get("/", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.getProviderServices);
route.post("/", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.addProviderServices);

export default route;