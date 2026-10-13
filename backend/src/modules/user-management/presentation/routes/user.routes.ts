import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { addressController, customerController, providerController, userController } from "../../infrastructure/composition/index.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";
import validate from "../../../../shared/presentation/http/middlewares/validate-request.js";
import { addressSchema } from "../validators/address.js";

const router = Router();

router.get("/customers",authMiddleware,requireRole(["ADMIN"]),customerController.getCustomers)
router.get("/providers",authMiddleware,requireRole(["ADMIN"]),providerController.getProviders)
router.get("/profile",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),userController.getProfile)
router.get("/address",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.getAddresses)
router.post("/address",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),validate(addressSchema),addressController.addAddress)
router.patch("/address/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),validate(addressSchema),addressController.editAddress)
router.patch("/address/default/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.setDefault)
router.patch("/status/:id",authMiddleware,requireRole(["ADMIN"]),userController.updateUserStatus)
router.delete("/address/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.delete)
router.post("/reactivation-request", userController.requestReactivation)

export default router