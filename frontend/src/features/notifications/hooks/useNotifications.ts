import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { ApiError } from "../../../shared/api/ApiError";
import {
  getNotifications,
  markAllNotificationsAsRead,
  updateNotificationStatus,
  type GetNotificationsParams,
} from "../services/notification.service";

export const useGetNotifications = () => {
  return useMutation({
    mutationFn: (params?: GetNotificationsParams) => getNotifications(params),
  });
};

export const useMarkAllNotificationsRead = () => {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onError: (error: ApiError) => toast.error(error.message),
  });
};

export const useUpdateNotificationStatus = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { isRead?: boolean; readAt?: Date | null };
    }) => updateNotificationStatus(id, data),
    onError: (error: ApiError) => toast.error(error.message),
  });
};

export {
  useSubscribePush,
  useUnsubscribePush,
  usePushSubscriptionStatus,
} from "./usePushNotifications";
