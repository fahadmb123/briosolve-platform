import { Router } from "express";
import type { NotificationController } from "../../presentation/controller/notification.controller";
import { createNotificationSchema, updateNotificationSchema } from "../validators/notification.validator";
import { authMiddleware } from "../../../../shared/presentation/http/middlewares/auth.middleware";
import validate from "../../../../shared/presentation/http/middlewares/validate-request";

export function createNotificationRouter(notificationController: NotificationController) {
    const router = Router();

    router.get("/unread-count", authMiddleware, notificationController.getUnreadCount);
    router.get("/", authMiddleware, notificationController.getNotifications);
    router.post("/", authMiddleware, validate(createNotificationSchema), notificationController.create);
    router.patch("/", authMiddleware, validate(updateNotificationSchema), notificationController.markAllAsRead);
    router.patch("/:id", authMiddleware, validate(updateNotificationSchema), notificationController.update);

    return router;
}
