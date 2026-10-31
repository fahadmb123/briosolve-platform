import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import "./NotificationsCenter.css";
import { useNotificationStore } from "../../stores/notification.store";
import {
  useGetNotifications,
  useMarkAllNotificationsRead,
  useUpdateNotificationStatus,
} from "../../hooks/useNotifications";
import { mapNotificationToUnified } from "../../utils/notification.mapper";
import { NotificationHeaderBanner } from "./components/NotificationHeaderBanner";

import {
  NotificationToolbar,
  type NotificationFilterTab,
} from "./components/NotificationToolbar";
import { NotificationEmptyState } from "./components/NotificationEmptyState";
import { NotificationItem } from "./components/NotificationItem";
import {
  TIME_GROUPS,
  ROLE_CONFIGS,
  type UserRole,
  type UnifiedNotificationItem,
} from "../../types/notification.types";

export interface NotificationsCenterProps {
  role?: UserRole;
}

export default function NotificationsCenter({
  role: propRole,
}: NotificationsCenterProps) {
  const location = useLocation();
  const userRole = useAuthStore((state) => state.user?.role);

  const activeRole: UserRole = useMemo(() => {
    if (propRole) return propRole;
    if (location.pathname.startsWith("/admin")) return "ADMIN";
    if (location.pathname.startsWith("/provider")) return "PROVIDER";
    const upper = userRole?.toUpperCase();
    if (upper === "ADMIN" || upper === "PROVIDER" || upper === "CUSTOMER") {
      return upper as UserRole;
    }
    return "CUSTOMER";
  }, [propRole, location.pathname, userRole]);

  const config = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.CUSTOMER;

  const [activeTab, setActiveTab] = useState<NotificationFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const updateNotification = useNotificationStore(
    (state) => state.updateNotification,
  );
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );

  const getNotificationsMutation = useGetNotifications();
  const markAllMutation = useMarkAllNotificationsRead();
  const updateStatusMutation = useUpdateNotificationStatus();

  useEffect(() => {
    getNotificationsMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res?.data) {
          setNotifications(res.data);
        }
      },
    });
  }, [setNotifications]);

  const unifiedNotifications: UnifiedNotificationItem[] = useMemo(() => {
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    return notifications
      .filter((n) => now - new Date(n.created_at).getTime() <= oneWeekMs)
      .map((n) => mapNotificationToUnified(n, activeRole));
  }, [notifications, activeRole]);

  const unreadCount = useMemo(
    () => unifiedNotifications.filter((n) => n.unread).length,
    [unifiedNotifications],
  );

  const handleMarkAllRead = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const readAt = new Date();
      notifications.forEach((notification) => {
        if (!notification.is_read) {
          updateNotification(notification.id, {
            is_read: true,
            read_at: readAt,
          });
        }
      });

      markAllMutation.mutate();
    },
    [notifications, updateNotification, markAllMutation],
  );

  const toggleReadStatus = useCallback(
    (id: string) => {
      const target = notifications.find((n) => n.id === id);
      if (!target) return;

      const nextRead = !target.is_read;
      const readAt = nextRead ? new Date() : null;

      updateNotification(id, {
        is_read: nextRead,
        read_at: readAt,
      });

      updateStatusMutation.mutate({
        id,
        data: {
          isRead: nextRead,
          readAt,
        },
      });
    },
    [notifications, updateNotification, updateStatusMutation],
  );

  const filteredNotifications = useMemo(() => {
    return unifiedNotifications.filter((item) => {
      if (activeTab === "unread" && !item.unread) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesMeta =
          item.metaTags?.some(
            (tag) =>
              tag.value.toLowerCase().includes(query) ||
              tag.label?.toLowerCase().includes(query),
          ) ?? false;

        if (!matchesTitle && !matchesSubtitle && !matchesMeta) {
          return false;
        }
      }
      return true;
    });
  }, [unifiedNotifications, activeTab, searchQuery]);

  const groups = useMemo(() => {
    const result = TIME_GROUPS.map((groupName) => ({
      group: groupName,
      items: filteredNotifications.filter((n) => n.group === groupName),
    })).filter((g) => g.items.length > 0);

    const matchedIds = new Set(result.flatMap((g) => g.items.map((i) => i.id)));
    const unassigned = filteredNotifications.filter((n) => !matchedIds.has(n.id));

    if (unassigned.length > 0) {
      result.push({
        group: "Earlier this month",
        items: unassigned,
      });
    }

    return result;
  }, [filteredNotifications]);

  const resetFilters = useCallback(() => {
    setActiveTab("all");
    setSearchQuery("");
  }, []);

  const isFiltered = Boolean(activeTab !== "all" || searchQuery);

  return (
    <div className="app-content notif-center-container">
      <NotificationHeaderBanner
        config={config}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllRead}
      />

      <NotificationToolbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={unifiedNotifications.length}
        unreadCount={unreadCount}
      />

      {groups.length === 0 ? (
        <NotificationEmptyState
          isFiltered={isFiltered}
          onResetFilters={resetFilters}
        />
      ) : (
        groups.map(({ group, items }) => (
          <div key={group} className="notif-group-card">
            <div className="notif-group-header">
              <span>{group}</span>
              <span>
                {items.length} {items.length === 1 ? "alert" : "alerts"}
              </span>
            </div>
            <div className="notif-list">
              {items.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onToggleRead={toggleReadStatus}
                  onRemove={removeNotification}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
