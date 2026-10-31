import webpush from "web-push";
import type { INotificationDelivery } from "../../application/interfaces/INotificationDelivery";
import type { NotificationResponseDto } from "../../application/dtos/response/notification-response.dto";
import type { IPushSubscriptionRepository } from "../../domain/repositories/IPushSubscription.respository";
import { logger } from "../../../../shared/infrastructure/logger/logger";

export class WebPushNotificationDeliveryAdapter implements INotificationDelivery {
    constructor(
        private readonly _pushSubscriptionRepository: IPushSubscriptionRepository,
    ) {
        if (process.env.VAPID_SUBJECT && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
            webpush.setVapidDetails(
                process.env.VAPID_SUBJECT,
                process.env.VAPID_PUBLIC_KEY,
                process.env.VAPID_PRIVATE_KEY,
            );
        }
    }

    deliver(notification: NotificationResponseDto): void {
        this.send(notification).catch((error) => {
            logger.error({ error }, "Web push delivery error");
        });
    }

    private async send(notification: NotificationResponseDto): Promise<void> {
        const subscriptions = await this._pushSubscriptionRepository.findByUserId(
            notification.recipient_id,
        );

        if (!subscriptions || subscriptions.length === 0) {
            return;
        }

        const payload = JSON.stringify({
            title: notification.title,
            body: notification.message,
            data: {
                id: notification.id,
                recipient_id: notification.recipient_id,
                type: notification.type,
                created_at: notification.created_at,
            },
        });

        await Promise.allSettled(
            subscriptions.map(async (sub) => {
                try {
                    await webpush.sendNotification(
                        {
                            endpoint: sub.endpoint,
                            keys: {
                                p256dh: sub.p256dh,
                                auth: sub.auth,
                            },
                        },
                        payload,
                    );
                } catch (error: any) {
                    if (error?.statusCode === 404 || error?.statusCode === 410) {
                        await this._pushSubscriptionRepository.deleteByEndpoint(sub.endpoint);
                    } else {
                        logger.error({ error, endpoint: sub.endpoint }, "Web push send failed");
                    }
                }
            }),
        );
    }
}

