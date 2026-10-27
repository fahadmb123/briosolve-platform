import type { Server } from "socket.io";
import { NotificationController } from "../../presentation/controller/notification.controller";
import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";
import { SocketIoNotificationDeliveryAdapter } from "../adapters/socket-io-notification-delivery.adapter";
import { notificastionRepository } from "./repositories";
import {
    getNotificationsUseCase,
    getUnreadCountUseCase,
    markAllAsReadUseCase,
    updateNotificationUseCase,
} from "./useCases";


export function createNotificationController(io: Server): NotificationController {
    const notificationDelivery = new SocketIoNotificationDeliveryAdapter(io);

    const createNotificationUsecase = new CreateNotificationUseCase(
        notificastionRepository,
        notificationDelivery,
    );

    return new NotificationController(
        createNotificationUsecase,
        getNotificationsUseCase,
        updateNotificationUseCase,
        markAllAsReadUseCase,
        getUnreadCountUseCase,
    );
}
