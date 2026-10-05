import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { customerController } from "../../container/container.js";


const router = Router()


router.get("/customers",authMiddleware,customerController.getCustomers)




export default router