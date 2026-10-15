import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import { providerServiceController } from "../../infrastructure/composition/controller";

const route = Router();

route.get("/", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.getProviderServices);
route.post("/", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.addProviderServices);
route.delete("/category/:id", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.deleteProviderCategory);
route.delete("/:id", authMiddleware, requireRole(["PROVIDER"]), providerServiceController.deleteProviderService);

export default route;