import { NotificationController } from "../../presentation/controller/notification.controller";
import { createNotificationUsecase, getNotificationsUseCase, markAllAsReadUseCase, updateNotificationUseCase } from "./useCases";

export const notificationController = new NotificationController(
    createNotificationUsecase,
    getNotificationsUseCase,
    updateNotificationUseCase,
    markAllAsReadUseCase
)