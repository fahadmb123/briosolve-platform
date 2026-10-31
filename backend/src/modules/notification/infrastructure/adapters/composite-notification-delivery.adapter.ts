import type { INotificationDelivery } from "../../application/interfaces/INotificationDelivery";
import type { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";

export class CompositeNotificationDeliveryAdapter implements INotificationDelivery {
    constructor(
        private readonly _deliveries: INotificationDelivery[],
    ) {}

    deliver(notification: NotificationResponseDto): void {
        for (const delivery of this._deliveries) {
            try {
                delivery.deliver(notification);
            } catch {
            }
        }
    }
}

