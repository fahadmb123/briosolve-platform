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
  useUpdateNotificationStatus,
  useGetNotifications,
  useMarkAllNotificationsRead,
} from "../hooks/useNotifications";
import { mapNotificationToHeader } from "../utils/notification.mapper";
import { NotificationDropdownItem } from "./NotificationDropdownItem";
import { NotificationDropdownEmpty } from "./NotificationDropdownEmpty";
import { NotificationDropdownSkeleton } from "./NotificationDropdownSkeleton";
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
  const [dropdownPage, setDropdownPage] = useState(1);
  const [dropdownTotalPages, setDropdownTotalPages] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const isFetchingMoreRef = useRef(false);

  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const updateNotification = useNotificationStore(
    (state) => state.updateNotification,
  );

  const updateStatusMutation = useUpdateNotificationStatus();
  const getNotificationsMutation = useGetNotifications();
  const markAllMutation = useMarkAllNotificationsRead();

  const handleMarkAllRead = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const readAt = new Date();
      notifications.forEach((item) => {
        if (!item.is_read) {
          updateNotification(item.id, {
            is_read: true,
            read_at: readAt,
          });
        }
      });

      markAllMutation.mutate();
    },
    [notifications, updateNotification, markAllMutation]
  );

  const resolvedRole = useMemo<UserRole>(() => {
    if (role) return role;
    if (user?.role === "PROVIDER") return "PROVIDER";
    if (user?.role === "ADMIN") return "ADMIN";
    return "CUSTOMER";
  }, [role, user?.role]);

  const unreadNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return [];
    try {
      const sorted = [...notifications].sort((a, b) => {
        const timeA = a?.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b?.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
      return sorted
        .filter((n) => n && !n.is_read)
        .map((notification) =>
          mapNotificationToHeader(notification, resolvedRole),
        )
        .filter(Boolean);
    } catch {
      return [];
    }
  }, [notifications, resolvedRole]);

  const unreadCount = unreadNotifications.length;

  const displayedNotifications = unreadNotifications;

  const targetViewAll = useMemo(() => {
    if (viewAllLink) return viewAllLink;
    return NOTIFICATION_ROUTES[resolvedRole] || NOTIFICATION_ROUTES.CUSTOMER;
  }, [viewAllLink, resolvedRole]);

  const fetchDropdownNotifications = useCallback((page: number, isReset: boolean = false) => {
    if (page > 1) {
      isFetchingMoreRef.current = true;
    }
    getNotificationsMutation.mutate(
      { page, limit: 5, unreadOnly: true },
      {
        onSuccess: (res) => {
          isFetchingMoreRef.current = false;
          if (res?.data) {
            if (Array.isArray(res.data)) {
              setNotifications(res.data);
            } else {
              const incoming = res.data.notifications || [];
              setNotifications(
                isReset || page === 1
                  ? incoming
                  : (() => {
                      const current = useNotificationStore.getState().notifications;
                      const existingIds = new Set(current.map((n) => n.id));
                      const newUnique = incoming.filter((n) => !existingIds.has(n.id));
                      return [...current, ...newUnique];
                    })()
              );
              setDropdownTotalPages(res.data.totalPages || 1);
            }
          }
        },
        onError: () => {
          isFetchingMoreRef.current = false;
        }
      }
    );
  }, [setNotifications, getNotificationsMutation]);

  const handleToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setDropdownPage(1);
        fetchDropdownNotifications(1, true);
      }
      return next;
    });
  }, [fetchDropdownNotifications]);

  const handleScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el || isFetchingMoreRef.current || getNotificationsMutation.isPending) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (nearBottom && dropdownPage < dropdownTotalPages) {
      const nextPage = dropdownPage + 1;
      setDropdownPage(nextPage);
      fetchDropdownNotifications(nextPage, false);
    }
  }, [dropdownPage, dropdownTotalPages, getNotificationsMutation.isPending, fetchDropdownNotifications]);

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
            <div className="notif-header-left">
              <div className="notif-header-bell-box">
                <i className="fas fa-bell"></i>
              </div>
              <div className="notif-header-info">
                <h3 className="notif-header-title">Notification</h3>
                <p className="notif-header-subtitle">
                  {unreadCount === 0
                    ? "No unread notifications"
                    : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>

            <div className="notif-header-actions-right">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="notif-mark-all-read-btn"
                  onClick={handleMarkAllRead}
                  disabled={markAllMutation.isPending}
                  title="Mark all as read"
                  aria-label="Mark all as read"
                >
                  <i className="fas fa-check-double"></i>
                </button>
              )}
              <button
                type="button"
                className="notif-header-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          <div className="notif-dropdown-body" ref={bodyRef} onScroll={handleScroll}>
            {getNotificationsMutation.isPending && notifications.length === 0 ? (
              <NotificationDropdownSkeleton />
            ) : displayedNotifications.length === 0 ? (
              <NotificationDropdownEmpty />
            ) : (
              <>
                {displayedNotifications.map((item) => (
                  <NotificationDropdownItem
                    key={item.id}
                    item={item}
                    onItemClick={handleItemClick}
                    onToggleRead={handleToggleRead}
                  />
                ))}
                {getNotificationsMutation.isPending && dropdownPage > 1 && (
                  <NotificationDropdownSkeleton />
                )}
              </>
            )}
          </div>

          <div className="notif-dropdown-footer">
            <Link
              to={targetViewAll}
              className="notif-view-all-link"
              onClick={() => setIsOpen(false)}
            >
              <span>View all notifications</span>
              <i className="fas fa-arrow-right text-xs notif-arrow-icon"></i>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
