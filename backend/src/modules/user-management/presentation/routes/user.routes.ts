import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { customerController, userController } from "../../container/container.js";
import { requireRole } from "../../../../shared/presentation/http/middlewares/role.middleware.js";



const router = Router();


router.get("/customers",authMiddleware,requireRole(["ADMIN"]),customerController.getCustomers)
router.get("/profile",authMiddleware,requireRole(["CUSTOMER","PROVIDER"]),userController.getProfile)

router.patch("/status/:id",authMiddleware,requireRole(["ADMIN"]),userController.updateUserStatus)



export default router