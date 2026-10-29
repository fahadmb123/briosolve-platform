import { useCallback, useEffect } from "react";
import { useNotificationStore } from "../stores/notification.store";
import {
  getNotifications,
  markAllNotificationsAsRead,
  updateNotificationStatus,
} from "../services/notification.service";

export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const updateNotification = useNotificationStore((state) => state.updateNotification);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getNotifications();
      if (res.data) {
        setNotifications(res.data);
      }
    } catch {}
  }, [setNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    const readAt = new Date();

    notifications.forEach((notification) => {
      if (!notification.is_read) {
        updateNotification(notification.id, {
          is_read: true,
          read_at: readAt,
        });
      }
    });

    try {
      await markAllNotificationsAsRead();
    } catch {}
  }, [notifications, updateNotification]);

  const toggleReadStatus = useCallback(
    async (id: string) => {
      const target = notifications.find((n) => n.id === id);
      if (!target) return;

      const nextRead = !target.is_read;
      const readAt = nextRead ? new Date() : null;

      updateNotification(id, {
        is_read: nextRead,
        read_at: readAt,
      });

      try {
        await updateNotificationStatus(id, {
          isRead: nextRead,
          readAt,
        });
      } catch {}
    },
    [notifications, updateNotification],
  );

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.is_read).length,
    fetchNotifications,
    markAllAsRead,
    toggleReadStatus,
    removeNotification,
  };
}
