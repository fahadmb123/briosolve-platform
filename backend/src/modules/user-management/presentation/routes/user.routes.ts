import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { addressSchema } from "../validators/address";
import { UserRouteDependencies } from "../types/user.route.dependencies";

export function buildUserRoute(controller: UserRouteDependencies): Router {
    const router = Router();

    router.get("/customers", authMiddleware, requireRole(["ADMIN"]), controller.customer.getCustomers);
    router.get("/providers", authMiddleware, requireRole(["ADMIN", "CUSTOMER"]), controller.provider.getProviders);
    router.get("/profile", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), controller.user.getProfile);
    router.get("/address", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), controller.address.getAddresses);
    router.post("/address", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(addressSchema), controller.address.addAddress);
    router.patch("/address/:id", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), validate(addressSchema), controller.address.editAddress);
    router.patch("/address/default/:id", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), controller.address.setDefault);
    router.patch("/status/:id", authMiddleware, requireRole(["ADMIN"]), controller.user.updateUserStatus);
    router.delete("/address/:id", authMiddleware, requireRole(["CUSTOMER", "PROVIDER"]), controller.address.delete);

    return router;
}