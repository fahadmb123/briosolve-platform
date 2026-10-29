
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth.store';
import './NotificationDropdown.css';
import { useNotificationStore } from '../store/notification.store';
import { mapNotificationToHeader } from '../utils/notification.mapper';
import {
  markAllNotificationsAsRead,
  updateNotificationStatus,
} from '../services/notification.service';

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  icon: string;
  iconColor: string;
  iconBg: string;
  link: string;
}
 
interface NotificationDropdownProps {
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  viewAllLink?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  role,
  viewAllLink,
}) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const updateNotification = useNotificationStore(
    (state) => state.updateNotification,
  );

  const notificationsFromStore = useNotificationStore(
    (state) => state.notifications,
  );

  const resolvedRole = useMemo(() => {
    if (role) return role;
    if (user?.role === 'PROVIDER') return 'PROVIDER';
    if (user?.role === 'ADMIN') return 'ADMIN';
    return 'CUSTOMER';
  }, [role, user?.role]);

  const notifications = useMemo(
    () =>
      notificationsFromStore.map((notification) =>
        mapNotificationToHeader(notification, resolvedRole),
      ),
    [notificationsFromStore, resolvedRole],
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications],
  );

  const displayedNotifications = useMemo(
    () =>
      activeTab === 'unread'
        ? notifications.filter((notification) => notification.unread)
        : notifications,
    [notifications, activeTab],
  );

  const targetViewAll = useMemo(() => {
    if (viewAllLink) return viewAllLink;
    if (resolvedRole === 'PROVIDER') return '/provider/notifications';
    if (resolvedRole === 'ADMIN') return '/admin/notifications';
    return '/notifications';
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

      notificationsFromStore.forEach((notification) => {
        if (!notification.is_read) {
          updateNotification(notification.id, {
            is_read: true,
            read_at: readAt,
          });
        }
      });

      markAllNotificationsAsRead().catch(() => {});
    },
    [notificationsFromStore, updateNotification],
  );

  const handleToggleRead = useCallback(
    (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const notification = notificationsFromStore.find(
        (item) => item.id === id,
      );

      if (!notification) return;

      const isRead = !notification.is_read;
      const readAt = isRead ? new Date() : null;

      updateNotification(id, {
        is_read: isRead,
        read_at: readAt,
      });

      updateNotificationStatus(id, {
        isRead,
        readAt,
      }).catch(() => {});
    },
    [notificationsFromStore, updateNotification],
  );

  const handleItemClick = useCallback(
    (item: HeaderNotification) => {
      const notification = notificationsFromStore.find(
        (entry) => entry.id === item.id,
      );

      if (notification && !notification.is_read) {
        updateNotification(item.id, {
          is_read: true,
          read_at: new Date(),
        });
      }

      setIsOpen(false);

      if (item.link) {
        navigate(item.link);
      }
    },
    [notificationsFromStore, updateNotification, navigate],
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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="notif-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        id="notif-toggle"
        className={`btn-icon notif-bell-btn ${isOpen ? 'active' : ''}`}
        aria-label="Notifications"
        aria-expanded={isOpen}
        title="Notifications"
        onClick={handleToggle}
      >
        <i className="fas fa-bell"></i>

        {unreadCount > 0 && (
          <span className="notif-badge-count" id="notif-badge">
            {unreadCount > 9 ? '9+' : unreadCount}
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

              {unreadCount > 0 ? (
                <span className="notif-unread-pill">
                  {unreadCount} new
                </span>
              ) : (
                <></>
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
                  activeTab === 'all' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('all')}
              >
                <span>Today</span>
                <span className="notif-segment-count">
                  {notifications.length}
                </span>
              </button>

              <button
                type="button"
                className={`notif-segment-btn ${
                  activeTab === 'unread' ? 'active' : ''
                }`}
                onClick={() => setActiveTab('unread')}
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
              <div className="notif-empty-state">
                <div className="notif-empty-icon">
                  <i className="fas fa-bell-slash"></i>
                </div>

                <p className="font-semibold text-text text-sm mb-1">
                  {activeTab === 'unread'
                    ? 'No unread notifications'
                    : 'No notifications yet'}
                </p>

                <p className="text-xs text-secondary mb-0">
                  {activeTab === 'unread'
                    ? 'Great job! You have read all your latest updates.'
                    : 'New activity, quotes, and messages will appear here.'}
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item.id}
                  className={`notif-dropdown-item ${
                    item.unread ? 'unread' : 'read'
                  }`}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleItemClick(item);
                    }
                  }}
                >
                  <div
                    className="notif-item-icon-box"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <i
                      className={`fas ${item.icon}`}
                      style={{ color: item.iconColor }}
                    ></i>
                  </div>

                  <div className="notif-item-content">
                    <div className="notif-item-header-row">
                      <span className="notif-item-title">
                        {item.title}
                      </span>

                      {item.unread && (
                        <span
                          className="notif-pulse-dot"
                          title="Unread"
                        ></span>
                      )}
                    </div>

                    <p className="notif-item-text">{item.message}</p>

                    <div className="notif-item-footer">
                      <span className="notif-item-time">
                        <i className="far fa-clock text-[10px]"></i>
                        <span>{item.time}</span>
                      </span>

                      <div
                        className="notif-item-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="btn-read-toggle"
                          onClick={(e) => handleToggleRead(item.id, e)}
                          title={
                            item.unread
                              ? 'Mark as read'
                              : 'Mark as unread'
                          }
                        >
                          <i
                            className={`fas ${
                              item.unread
                                ? 'fa-check'
                                : 'fa-envelope-open'
                            }`}
                          ></i>

                          <span>
                            {item.unread ? 'Mark read' : 'Unread'}
                          </span>
                        </button>

                        <button
                          type="button"
                          className="notif-quick-view-link"
                          onClick={() => handleItemClick(item)}
                        >
                          <span>View</span>
                          <i className="fas fa-arrow-right text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
