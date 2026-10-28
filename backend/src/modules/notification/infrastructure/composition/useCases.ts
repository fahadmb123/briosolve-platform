import { GetNotificationsUseCase } from "../../application/use-cases/getNotifications.useCase";
import { GetUnreadCountUseCase } from "../../application/use-cases/getUnreadCount.useCase";
import { MarkAllAsReadUseCase } from "../../application/use-cases/markAllAsRead.useCase";
import { UpdateNotificationUseCase } from "../../application/use-cases/updateNotification.useCase";
import { notificastionRepository, userRepository } from "./repositories";
import type { Server } from "socket.io";
import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";
import { SocketIoNotificationDeliveryAdapter } from "../adapters/socket-io-notification-delivery.adapter";

export const getNotificationsUseCase = new GetNotificationsUseCase(
    notificastionRepository,
    userRepository,
);

export const updateNotificationUseCase = new UpdateNotificationUseCase(
    notificastionRepository,
    userRepository,
);

export const markAllAsReadUseCase = new MarkAllAsReadUseCase(
    notificastionRepository,
    userRepository,
);

export const getUnreadCountUseCase = new GetUnreadCountUseCase(
    notificastionRepository,
    userRepository,
)

export function createNotificationUseCase(
    io: Server,
): CreateNotificationUseCase {
    const notificationDelivery = new SocketIoNotificationDeliveryAdapter(io);

    return new CreateNotificationUseCase(
        notificastionRepository,
        notificationDelivery,
    );
}