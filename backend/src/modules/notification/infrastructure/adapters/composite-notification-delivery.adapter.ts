import type { INotificationDelivery } from "../../application/interfaces/INotificationDelivery";
import type { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";
import { logger } from "../../../../shared/infrastructure/logger/logger";

export class CompositeNotificationDeliveryAdapter implements INotificationDelivery {
    constructor(
        private readonly _deliveries: INotificationDelivery[],
    ) {}

    async deliver(notification: NotificationResponseDto): Promise<void> {
        const results = await Promise.allSettled(
            this._deliveries.map(delivery =>
                delivery.deliver(notification)
            )
        );

        results.forEach((result) => {
            if (result.status === "rejected") {
                logger.error(
                    { error: result.reason },
                    "Notification delivery failed",
                );
            }
        });
    }
}

