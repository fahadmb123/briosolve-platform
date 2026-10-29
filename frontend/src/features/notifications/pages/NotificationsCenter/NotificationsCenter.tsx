import React, { useState, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import "./NotificationsCenter.css";
import { useNotifications } from "../../hooks/useNotifications";
import { mapNotificationToUnified } from "../../utils/notification.mapper";
import {
  TIME_GROUPS,
  ROLE_CONFIGS,
} from "../../constants/notification.constants";
import { NotificationHeaderBanner } from "./components/NotificationHeaderBanner";
import { NotificationStatStrip } from "./components/NotificationStatStrip";
import { NotificationToolbar } from "./components/NotificationToolbar";
import { NotificationEmptyState } from "./components/NotificationEmptyState";
import { NotificationItem } from "./components/NotificationItem";
import type {
  UserRole,
  UnifiedNotificationItem,
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

  const [activeTab, setActiveTab] = useState<string>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    notifications,
    markAllAsRead,
    toggleReadStatus,
    removeNotification,
  } = useNotifications();

  const unifiedNotifications: UnifiedNotificationItem[] = useMemo(() => {
    return notifications.map((n) => mapNotificationToUnified(n, activeRole));
  }, [notifications, activeRole]);

  const unreadCount = useMemo(
    () => unifiedNotifications.filter((n) => n.unread).length,
    [unifiedNotifications],
  );

  const stats = useMemo(
    () => config.getStats(unifiedNotifications, unreadCount),
    [config, unifiedNotifications, unreadCount],
  );

  const handleMarkAllRead = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      markAllAsRead();
    },
    [markAllAsRead],
  );

  const filteredNotifications = useMemo(() => {
    return unifiedNotifications.filter((item) => {
      if (activeTab !== "all" && item.category !== activeTab) {
        return false;
      }
      if (showUnreadOnly && !item.unread) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesBadge =
          item.badgeLabel?.toLowerCase().includes(query) ?? false;
        const matchesMeta =
          item.metaTags?.some(
            (tag) =>
              tag.value.toLowerCase().includes(query) ||
              tag.label?.toLowerCase().includes(query),
          ) ?? false;

        if (!matchesTitle && !matchesSubtitle && !matchesBadge && !matchesMeta) {
          return false;
        }
      }
      return true;
    });
  }, [unifiedNotifications, activeTab, showUnreadOnly, searchQuery]);

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
    setShowUnreadOnly(false);
    setSearchQuery("");
  }, []);

  const isFiltered = Boolean(showUnreadOnly || searchQuery || activeTab !== "all");

  return (
    <div className="app-content notif-center-container">
      <NotificationHeaderBanner
        config={config}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllRead}
      />

      <NotificationStatStrip stats={stats} />

      <NotificationToolbar
        categories={config.categories}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showUnreadOnly={showUnreadOnly}
        onToggleUnreadOnly={() => setShowUnreadOnly((prev) => !prev)}
        unifiedNotifications={unifiedNotifications}
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
