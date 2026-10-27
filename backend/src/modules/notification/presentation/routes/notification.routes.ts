import { Router } from "express";
import { notificationController } from "../../infrastructure/composition/index";
import { createNotificationSchema, updateNotificationSchema } from "../validators/notification.validator";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";

const router = Router()

router.get("/",authMiddleware,notificationController.getNotifications)
router.post("/",authMiddleware,validate(createNotificationSchema),notificationController.create)
router.patch("/",authMiddleware,validate(updateNotificationSchema),notificationController.markAllAsRead)
router.patch("/:id",authMiddleware,validate(updateNotificationSchema),notificationController.update)

export default router