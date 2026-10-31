import { urlBase64ToUint8Array } from "../utils/vapid.utils";
import {
    subscribePushNotificationApi,
    unsubscribePushNotificationApi,
} from "./notification.service";
import type { PushSubscriptionPayload } from "../types/notification.types";
import type { response } from "../../../shared/types/Dtos";

export const isPushNotificationSupported = (): boolean => {
    return (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        "PushManager" in window &&
        "Notification" in window
    );
};

export const getPushPermissionState = (): NotificationPermission => {
    if (typeof window === "undefined" || !("Notification" in window)) {
        return "default";
    }
    return Notification.permission;
};

export const getExistingPushSubscription = async (): Promise<PushSubscription | null> => {
    if (!isPushNotificationSupported()) return null;
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
};

export const registerAndSubscribePush = async (
    vapidKey?: string
): Promise<PushSubscriptionPayload> => {
    if (!isPushNotificationSupported()) {
        throw new Error("Push notifications are not supported in this browser.");
    }

    const key = vapidKey || import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!key) {
        throw new Error("VAPID public key is not configured.");
    }

    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        throw new Error("Notification permission was denied.");
    }

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
        subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(key) as unknown as BufferSource,
        });
    }

    const json = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = json.keys?.p256dh || "";
    const auth = json.keys?.auth || "";

    if (!endpoint || !p256dh || !auth) {
        throw new Error("Unable to read push subscription keys.");
    }

    return { endpoint, p256dh, auth };
};

export const unsubscribeBrowserPush = async (): Promise<string | null> => {
    if (!isPushNotificationSupported()) return null;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return null;
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();
    return endpoint;
};

export const subscribePush = async (
    vapidKey?: string
): Promise<response<void>> => {
    const payload = await registerAndSubscribePush(vapidKey);
    return subscribePushNotificationApi(payload);
};

export const unsubscribePush = async (): Promise<response<void> | null> => {
    const endpoint = await unsubscribeBrowserPush();
    if (!endpoint) return null;
    return unsubscribePushNotificationApi({ endpoint });
};
