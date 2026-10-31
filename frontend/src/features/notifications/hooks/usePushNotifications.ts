import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiError } from "../../../shared/api/ApiError";
import {
    getExistingPushSubscription,
    getPushPermissionState,
    isPushNotificationSupported,
    subscribePush,
    unsubscribePush,
} from "../services/push.service";

export const usePushSubscriptionStatus = () => {
    return useQuery({
        queryKey: ["push-subscription-status"],
        queryFn: async () => {
            const supported = isPushNotificationSupported();
            if (!supported) {
                return {
                    isSupported: false,
                    permission: "default" as NotificationPermission,
                    isSubscribed: false,
                };
            }
            const permission = getPushPermissionState();
            const sub = await getExistingPushSubscription();
            return {
                isSupported: true,
                permission,
                isSubscribed: !!sub,
            };
        },
    });
};

export const useSubscribePush = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (vapidKey?: string) => subscribePush(vapidKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["push-subscription-status"] });
        },
        onError: (error: ApiError | Error) => {
            toast.error(error.message || "Failed to subscribe to push notifications");
        },
    });
};

export const useUnsubscribePush = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => unsubscribePush(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["push-subscription-status"] });
        },
        onError: (error: ApiError | Error) => {
            toast.error(error.message || "Failed to unsubscribe from push notifications");
        },
    });
};

