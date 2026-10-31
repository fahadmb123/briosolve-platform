import type { Server } from "socket.io";
import { NotificationController } from "../../presentation/controller/notification.controller";
import {
    createNotificationUseCase,
    getNotificationsUseCase,
    getUnreadCountUseCase,
    markAllAsReadUseCase,
    updateNotificationUseCase,
    savePushSubscriptionUseCase,
    deletePushSubscriptionUseCase,
} from "./useCases";
import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";

export function createNotificationController(
    io: Server,
    createNotificationUseCaseInstance?: CreateNotificationUseCase,
): NotificationController {
    const createNotificationUsecase =
        createNotificationUseCaseInstance ?? createNotificationUseCase(io);

    return new NotificationController(
        createNotificationUsecase,
        getNotificationsUseCase,
        updateNotificationUseCase,
        markAllAsReadUseCase,
        getUnreadCountUseCase,
        savePushSubscriptionUseCase,
        deletePushSubscriptionUseCase,
    );
}
