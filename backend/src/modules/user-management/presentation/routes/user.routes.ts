import { Router } from "express";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware.js";
import { userController } from "../../container/container.js";

const router = Router();


router.patch("/status/:id",authMiddleware,userController.updateUserStatus)


export default router