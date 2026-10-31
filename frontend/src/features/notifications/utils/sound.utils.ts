const NOTIFICATION_SOUND_PATH = "/sounds/notification.mp3";

const notificationAudio = typeof Audio !== "undefined" ? new Audio(NOTIFICATION_SOUND_PATH) : null;

export const playNotificationSound = (): void => {
    if (!notificationAudio) return;

    notificationAudio.currentTime = 0;
    notificationAudio.play().catch(() => {});
};
