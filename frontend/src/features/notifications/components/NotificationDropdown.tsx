import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/stores/auth.store';
import './NotificationDropdown.css';

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

const DEFAULT_CUSTOMER_NOTIFICATIONS: HeaderNotification[] = [
  {
    id: 'cn-1',
    title: 'New Quotation Received',
    message: 'Apex Plumbing Solutions quoted ₹3,200 for "Bathroom Plumbing Repair & Leak Fix". Includes 90-day warranty.',
    time: '20m ago',
    unread: true,
    icon: 'fa-file-invoice-dollar',
    iconColor: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    link: '/notifications'
  },
  {
    id: 'cn-2',
    title: 'New Message from Farhan',
    message: 'Pressure test is holding up nicely. I have added photos of the replacement valve in our chat.',
    time: '1h ago',
    unread: true,
    icon: 'fa-comment-dots',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    link: '/notifications'
  },
  {
    id: 'cn-3',
    title: 'Service Started • Booking #BK-8891',
    message: 'Farhan Ansari arrived on premises in Kodungallur and marked the job milestone as In Progress.',
    time: '3h ago',
    unread: false,
    icon: 'fa-calendar-check',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    link: '/notifications'
  },
  {
    id: 'cn-4',
    title: 'Special Weekend Discount',
    message: 'Enjoy 15% off on AC cleaning & duct inspection bookings this weekend.',
    time: '1d ago',
    unread: true,
    icon: 'fa-tag',
    iconColor: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    link: '/notifications'
  }
];

const DEFAULT_PROVIDER_NOTIFICATIONS: HeaderNotification[] = [
  {
    id: 'pn-1',
    title: 'Urgent Service Lead in Your Radius',
    message: 'Homeowner in Kodungallur needs "Main Distribution Board Tripping & Wiring Leakage Repair".',
    time: '12m ago',
    unread: true,
    icon: 'fa-bolt',
    iconColor: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    link: '/provider/notifications'
  },
  {
    id: 'pn-2',
    title: 'Quotation Accepted! 🎉',
    message: 'Vikram Menon accepted your ₹3,500 quotation for "Kitchen Exhaust Duct Cleaning & Fan Repair".',
    time: '45m ago',
    unread: true,
    icon: 'fa-check-circle',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    link: '/provider/notifications'
  },
  {
    id: 'pn-3',
    title: 'Reminder: Scheduled Job at 3:00 PM',
    message: 'Water Tank Float Valve replacement with Ananya Rao. Verify OTP upon arrival.',
    time: '2h ago',
    unread: false,
    icon: 'fa-clock',
    iconColor: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    link: '/provider/notifications'
  },
  {
    id: 'pn-4',
    title: 'Weekly Payout Processed',
    message: '₹7,850 successfully transferred to your registered bank account for completed services.',
    time: '1d ago',
    unread: true,
    icon: 'fa-wallet',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    link: '/provider/notifications'
  }
];

const DEFAULT_ADMIN_NOTIFICATIONS: HeaderNotification[] = [
  {
    id: 'an-1',
    title: 'Escalated Customer Dispute #DSP-304',
    message: 'Booking #BK-1049 reported for pipe joint damage. ₹3,200 payment hold triggered.',
    time: '15m ago',
    unread: true,
    icon: 'fa-exclamation-triangle',
    iconColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    link: '/admin/notifications'
  },
  {
    id: 'an-2',
    title: 'New Verification Documents Submitted',
    message: 'Royal Electrical Solutions submitted Trade License & Aadhaar for Verified Pro review.',
    time: '35m ago',
    unread: true,
    icon: 'fa-id-card',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    link: '/admin/verification'
  },
  {
    id: 'an-3',
    title: 'Account Reactivation Requested',
    message: 'Deactivated provider "SafeVolt Air Conditioning" completed OTP verification.',
    time: '2h ago',
    unread: true,
    icon: 'fa-user-clock',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    link: '/admin/reactivations'
  },
  {
    id: 'an-4',
    title: 'Nightly Database Backup Successful',
    message: 'Automated PostgreSQL database cluster snapshot completed without errors.',
    time: '6h ago',
    unread: false,
    icon: 'fa-database',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    link: '/admin/notifications'
  }
];

interface NotificationDropdownProps {
  role?: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  viewAllLink?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  role,
  viewAllLink
}) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  // Determine user role
  const resolvedRole = useMemo(() => {
    if (role) return role;
    if (user?.role === 'PROVIDER') return 'PROVIDER';
    if (user?.role === 'ADMIN') return 'ADMIN';
    return 'CUSTOMER';
  }, [role, user?.role]);

  // Initial notifications per role
  const initialData = useMemo(() => {
    if (resolvedRole === 'PROVIDER') return DEFAULT_PROVIDER_NOTIFICATIONS;
    if (resolvedRole === 'ADMIN') return DEFAULT_ADMIN_NOTIFICATIONS;
    return DEFAULT_CUSTOMER_NOTIFICATIONS;
  }, [resolvedRole]);

  const [notifications, setNotifications] = useState<HeaderNotification[]>(initialData);

  // Sync if role changes
  useEffect(() => {
    setNotifications(initialData);
  }, [initialData]);

  // Derived unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  // Filtered notifications
  const displayedNotifications = useMemo(() => {
    if (activeTab === 'unread') {
      return notifications.filter((n) => n.unread);
    }
    return notifications;
  }, [notifications, activeTab]);

  // Resolved View All Link
  const targetViewAll = useMemo(() => {
    if (viewAllLink) return viewAllLink;
    if (resolvedRole === 'PROVIDER') return '/provider/notifications';
    if (resolvedRole === 'ADMIN') return '/admin/notifications';
    return '/notifications';
  }, [viewAllLink, resolvedRole]);

  // Toggle open
  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  // Mark all as read
  const handleMarkAllRead = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, unread: false }))
    );
  }, []);

  // Toggle single item read status
  const handleToggleRead = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    );
  }, []);

  // Handle click on item
  const handleItemClick = useCallback(
    (item: HeaderNotification) => {
      // Mark clicked item as read
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
      );
      setIsOpen(false);
      if (item.link) {
        navigate(item.link);
      }
    },
    [navigate]
  );

  // Close on click outside
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

  // Close on Escape key
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
      {/* Bell Button */}
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

      {/* Notification Dropdown Modal */}
      {isOpen && (
        <div className="notif-dropdown-modal show" role="dialog" aria-label="Notifications dropdown">
          {/* Header */}
          <div className="notif-dropdown-header">
            <div className="flex items-center gap-2.5">
              <h3 className="notif-header-title">Notifications</h3>
              {unreadCount > 0 ? (
                <span className="notif-unread-pill">{unreadCount} new</span>
              ) : (
                <span className="notif-caught-up-pill">
                  <i className="fas fa-check"></i> Caught up
                </span>
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

          {/* Segmented Control Filter Tabs */}
          <div className="notif-tabs-container">
            <div className="notif-segmented-control">
              <button
                type="button"
                className={`notif-segment-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <span>Today</span>
                <span className="notif-segment-count">{notifications.length}</span>
              </button>
              <button
                type="button"
                className={`notif-segment-btn ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                <span>Unread</span>
                {unreadCount > 0 && (
                  <span className="notif-segment-count unread-badge">{unreadCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Body Items List */}
          <div className="notif-dropdown-body">
            {displayedNotifications.length === 0 ? (
              <div className="notif-empty-state">
                <div className="notif-empty-icon">
                  <i className="fas fa-bell-slash"></i>
                </div>
                <p className="font-semibold text-text text-sm mb-1">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications yet'}
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
                  className={`notif-dropdown-item ${item.unread ? 'unread' : 'read'}`}
                  onClick={() => handleItemClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleItemClick(item);
                    }
                  }}
                >
                  {/* Category Icon */}
                  <div
                    className="notif-item-icon-box"
                    style={{ backgroundColor: item.iconBg }}
                  >
                    <i
                      className={`fas ${item.icon}`}
                      style={{ color: item.iconColor }}
                    ></i>
                  </div>

                  {/* Content */}
                  <div className="notif-item-content">
                    <div className="notif-item-header-row">
                      <span className="notif-item-title">{item.title}</span>
                      {item.unread && <span className="notif-pulse-dot" title="Unread"></span>}
                    </div>
                    <p className="notif-item-text">{item.message}</p>
                    <div className="notif-item-footer">
                      <span className="notif-item-time">
                        <i className="far fa-clock text-[10px]"></i>
                        <span>{item.time}</span>
                      </span>
                      <div className="notif-item-actions" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="btn-read-toggle"
                          onClick={(e) => handleToggleRead(item.id, e)}
                          title={item.unread ? 'Mark as read' : 'Mark as unread'}
                        >
                          <i
                            className={`fas ${item.unread ? 'fa-check' : 'fa-envelope-open'}`}
                          ></i>
                          <span>{item.unread ? 'Mark read' : 'Unread'}</span>
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

          {/* Footer */}
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
