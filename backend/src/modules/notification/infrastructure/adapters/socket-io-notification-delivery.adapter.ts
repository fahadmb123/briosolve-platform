import type { Server } from "socket.io";
import type { INotificationDelivery } from "../../application/interfaces/INotificationDelivery";
import type { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";

export class SocketIoNotificationDeliveryAdapter implements INotificationDelivery {

    constructor(
        private readonly _io: Server,
    ) {}

    deliver(notification: NotificationResponseDto): void {
        this._io
            .to(`user:${notification.recipient_id}`)
            .emit("notification:new", notification);
    }
}
