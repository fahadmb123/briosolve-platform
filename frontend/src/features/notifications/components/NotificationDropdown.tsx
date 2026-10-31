import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/stores/auth.store";
import "./NotificationDropdown.css";
import { useNotificationStore } from "../stores/notification.store";
import {
  useMarkAllNotificationsRead,
  useUpdateNotificationStatus,
} from "../hooks/useNotifications";
import { mapNotificationToHeader } from "../utils/notification.mapper";
import { NotificationDropdownItem } from "./NotificationDropdownItem";
import { NotificationDropdownEmpty } from "./NotificationDropdownEmpty";
import {
  MAX_DROPDOWN_BADGE_COUNT,
  NOTIFICATION_ROUTES,
  type HeaderNotification,
  type NotificationDropdownProps,
  type UserRole,
} from "../types/notification.types";

export type { HeaderNotification, NotificationDropdownProps };

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  role,
  viewAllLink,
}) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const notifications = useNotificationStore((state) => state.notifications);
  const updateNotification = useNotificationStore(
    (state) => state.updateNotification,
  );

  const markAllMutation = useMarkAllNotificationsRead();
  const updateStatusMutation = useUpdateNotificationStatus();

  const resolvedRole = useMemo<UserRole>(() => {
    if (role) return role;
    if (user?.role === "PROVIDER") return "PROVIDER";
    if (user?.role === "ADMIN") return "ADMIN";
    return "CUSTOMER";
  }, [role, user?.role]);

  const headerNotifications = useMemo(
    () =>
      notifications.map((notification) =>
        mapNotificationToHeader(notification, resolvedRole),
      ),
    [notifications, resolvedRole],
  );

  const unreadCount = useMemo(
    () => headerNotifications.filter((n) => n.unread).length,
    [headerNotifications],
  );

  const displayedNotifications = useMemo(
    () =>
      activeTab === "unread"
        ? headerNotifications.filter((n) => n.unread)
        : headerNotifications,
    [headerNotifications, activeTab],
  );

  const targetViewAll = useMemo(() => {
    if (viewAllLink) return viewAllLink;
    return NOTIFICATION_ROUTES[resolvedRole] || NOTIFICATION_ROUTES.CUSTOMER;
  }, [viewAllLink, resolvedRole]);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

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

  const handleToggleRead = useCallback(
    (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const notification = notifications.find((item) => item.id === id);
      if (!notification) return;

      const isRead = !notification.is_read;
      const readAt = isRead ? new Date() : null;

      updateNotification(id, {
        is_read: isRead,
        read_at: readAt,
      });

      updateStatusMutation.mutate({
        id,
        data: {
          isRead,
          readAt,
        },
      });
    },
    [notifications, updateNotification, updateStatusMutation],
  );

  const handleItemClick = useCallback(
    (item: HeaderNotification) => {
      if (item.unread) {
        updateNotification(item.id, {
          is_read: true,
          read_at: new Date(),
        });
        updateStatusMutation.mutate({
          id: item.id,
          data: {
            isRead: true,
            readAt: new Date(),
          },
        });
      }
      setIsOpen(false);
      if (item.link) {
        navigate(item.link);
      }
    },
    [updateNotification, updateStatusMutation, navigate],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="notif-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        id="notif-toggle"
        className={`btn-icon notif-bell-btn ${isOpen ? "active" : ""}`}
        aria-label="Notifications"
        aria-expanded={isOpen}
        title="Notifications"
        onClick={handleToggle}
      >
        <i className="fas fa-bell"></i>

        {unreadCount > 0 && (
          <span className="notif-badge-count" id="notif-badge">
            {unreadCount > MAX_DROPDOWN_BADGE_COUNT
              ? `${MAX_DROPDOWN_BADGE_COUNT}+`
              : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notif-dropdown-modal show"
          role="dialog"
          aria-label="Notifications dropdown"
        >
          <div className="notif-dropdown-header">
            <div className="flex items-center gap-2.5">
              <h3 className="notif-header-title">Notifications</h3>
              {unreadCount > 0 && (
                <span className="notif-unread-pill">{unreadCount} new</span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                className="btn-mark-all-read"
                onClick={handleMarkAllRead}
                title="Mark all notifications as read"
              >
                <i className="fas fa-check-double text-xs"></i>
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="notif-tabs-container">
            <div className="notif-segmented-control">
              <button
                type="button"
                className={`notif-segment-btn ${
                  activeTab === "all" ? "active" : ""
                }`}
                onClick={() => setActiveTab("all")}
              >
                <span>Today</span>
                <span className="notif-segment-count">
                  {headerNotifications.length}
                </span>
              </button>

              <button
                type="button"
                className={`notif-segment-btn ${
                  activeTab === "unread" ? "active" : ""
                }`}
                onClick={() => setActiveTab("unread")}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="notif-segment-count unread-badge">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="notif-dropdown-body">
            {displayedNotifications.length === 0 ? (
              <NotificationDropdownEmpty activeTab={activeTab} />
            ) : (
              displayedNotifications.map((item) => (
                <NotificationDropdownItem
                  key={item.id}
                  item={item}
                  onItemClick={handleItemClick}
                  onToggleRead={handleToggleRead}
                />
              ))
            )}
          </div>

          <div className="notif-dropdown-footer">
            <Link
              to={targetViewAll}
              className="notif-view-all-link"
              onClick={() => setIsOpen(false)}
            >
              <span>View all activity alerts</span>
              <i className="fas fa-arrow-right text-xs notif-arrow-icon"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
