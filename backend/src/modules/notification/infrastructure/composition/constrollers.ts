import { NotificationController } from "../../presentation/controller/notification.controller";
import { createNotificationUsecase, getNotificationsUseCase, getUnreadCountUseCase, markAllAsReadUseCase, updateNotificationUseCase } from "./useCases";

export const notificationController = new NotificationController(
    createNotificationUsecase,
    getNotificationsUseCase,
    updateNotificationUseCase,
    markAllAsReadUseCase,
    getUnreadCountUseCase
)