import { NotificationController } from "../../presentation/controller/notification.controller";
import { createNotificationUsecase } from "./useCases";

export const notificationController = new NotificationController(
    createNotificationUsecase
)