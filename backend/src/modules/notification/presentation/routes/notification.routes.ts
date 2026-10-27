import { Router } from "express";
import { notificationController } from "../../infrastructure/composition/index";
import { createNotificationSchema } from "../validators/notification.validator";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";

const router = Router()

router.post("/",authMiddleware,validate(createNotificationSchema),notificationController.create)

export default router