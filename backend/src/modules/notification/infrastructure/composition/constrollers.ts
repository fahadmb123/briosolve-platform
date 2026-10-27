import { NotificationController } from "../../presentation/controller/notification.controller";
import { createNotificationUsecase, getNotificationsUseCase } from "./useCases";

export const notificationController = new NotificationController(
    createNotificationUsecase,
    getNotificationsUseCase
)