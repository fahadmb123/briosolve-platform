import { NOTIFICATION_SOUND_PATH } from "../constants/notification.constants";

const notificationAudio = typeof Audio !== "undefined" ? new Audio(NOTIFICATION_SOUND_PATH) : null;

export const playNotificationSound = (): void => {
    if (!notificationAudio) return;

    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(() => {});
};

