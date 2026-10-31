import { GetNotificationsUseCase } from "../../application/use-cases/getNotifications.useCase";
import { GetUnreadCountUseCase } from "../../application/use-cases/getUnreadCount.useCase";
import { MarkAllAsReadUseCase } from "../../application/use-cases/markAllAsRead.useCase";
import { UpdateNotificationUseCase } from "../../application/use-cases/updateNotification.useCase";
import { notificastionRepository, pushSubscriptionRepository, userRepository } from "./repositories";
import type { Server } from "socket.io";
import { CreateNotificationUseCase } from "../../application/use-cases/createNotification.usecase";
import { SocketIoNotificationDeliveryAdapter } from "../adapters/socket-io-notification-delivery.adapter";
import { WebPushNotificationDeliveryAdapter } from "../adapters/web-push-notification-delivery.adapter";
import { CompositeNotificationDeliveryAdapter } from "../adapters/composite-notification-delivery.adapter";
import { SavePushSubscriptionUseCase } from "../../application/use-cases/savePushSubscription.useCase";
import { DeletePushSubscriptionUseCase } from "../../application/use-cases/deletePushSubscription.useCase";

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
);

export const savePushSubscriptionUseCase = new SavePushSubscriptionUseCase(
    pushSubscriptionRepository,
    userRepository,
);

export const deletePushSubscriptionUseCase = new DeletePushSubscriptionUseCase(
    pushSubscriptionRepository,
);

export function createNotificationUseCase(
    io: Server,
): CreateNotificationUseCase {
    const socketIoDelivery = new SocketIoNotificationDeliveryAdapter(io);
    const webPushDelivery = new WebPushNotificationDeliveryAdapter(pushSubscriptionRepository);
    const notificationDelivery = new CompositeNotificationDeliveryAdapter([
        socketIoDelivery,
        webPushDelivery,
    ]);

    return new CreateNotificationUseCase(
        notificastionRepository,
        notificationDelivery,
    );
}
