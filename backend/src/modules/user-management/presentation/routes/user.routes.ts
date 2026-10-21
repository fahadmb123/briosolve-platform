import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import { addressController, customerController, providerController, userController } from "../../infrastructure/composition/index";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";
import { addressSchema } from "../validators/address";

const router = Router();

router.get("/customers",authMiddleware,requireRole(["ADMIN"]),customerController.getCustomers)
router.get("/providers",authMiddleware,requireRole(["ADMIN", "CUSTOMER"]),providerController.getProviders)
router.get("/profile",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),userController.getProfile)
router.get("/address",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.getAddresses)
router.post("/address",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),validate(addressSchema),addressController.addAddress)
router.patch("/address/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),validate(addressSchema),addressController.editAddress)
router.patch("/address/default/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.setDefault)
router.patch("/status/:id",authMiddleware,requireRole(["ADMIN"]),userController.updateUserStatus)
router.delete("/address/:id",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),addressController.delete)

export default router