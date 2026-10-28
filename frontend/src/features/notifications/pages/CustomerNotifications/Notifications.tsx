import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

interface CustomerNotificationItem {
  id: string;
  category: 'quote' | 'booking' | 'chat' | 'review' | 'system';
  title: string;
  subtitle: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Earlier this month';
  unread: boolean;
  providerName?: string;
  amount?: string;
  serviceTitle?: string;
  bookingId?: string;
  primaryAction?: { label: string; link: string };
  secondaryAction?: { label: string; link: string };
}

const INITIAL_CUSTOMER_NOTIFICATIONS: CustomerNotificationItem[] = [
  {
    id: 'cn-1',
    category: 'quote',
    title: 'New Quotation Received',
    subtitle: 'Apex Plumbing Solutions quoted ₹3,200 for "Bathroom Plumbing Repair & Leak Fix". Includes 90-day warranty.',
    time: '20m ago',
    group: 'Today',
    unread: true,
    providerName: 'Farhan Ansari',
    amount: '₹3,200',
    primaryAction: { label: 'View Quotation', link: '#' },
    secondaryAction: { label: 'Compare (7)', link: '#' }
  },
  {
    id: 'cn-2',
    category: 'chat',
    title: 'New Message from Farhan Ansari',
    subtitle: '"Pressure test is holding up nicely. I have added photos of the replacement valve in our chat."',
    time: '1h ago',
    group: 'Today',
    unread: true,
    providerName: 'Farhan Ansari',
    primaryAction: { label: 'Reply in Chat', link: '#' }
  },
  {
    id: 'cn-3',
    category: 'booking',
    title: 'Service Started • Booking #BK-8891',
    subtitle: 'Farhan Ansari arrived on premises in Kodungallur and marked the job milestone as In Progress.',
    time: '3h ago',
    group: 'Today',
    unread: false,
    bookingId: '#BK-8891',
    primaryAction: { label: 'Track Milestone', link: '#' }
  },
  {
    id: 'cn-4',
    category: 'booking',
    title: 'Booking Confirmed with Rajesh Patil',
    subtitle: '"Kitchen Water Purifier Installation" has been locked for Oct 14 at 10:30 AM.',
    time: 'Yesterday, 6:00 PM',
    group: 'Yesterday',
    unread: false,
    providerName: 'Rajesh Patil',
    primaryAction: { label: 'View Schedule', link: '#' }
  },
  {
    id: 'cn-5',
    category: 'review',
    title: 'How was your AC Servicing experience?',
    subtitle: 'Sunil Verma completed your AC foam jet service. Help fellow homeowners by leaving a verified rating.',
    time: 'Yesterday, 11:30 AM',
    group: 'Yesterday',
    unread: false,
    providerName: 'Sunil Verma',
    primaryAction: { label: 'Leave Review', link: '#' }
  },
  {
    id: 'cn-6',
    category: 'system',
    title: 'Security Login Alert',
    subtitle: 'Your customer account was accessed from Chrome on Windows (IP: 103.48.xx.xx, Mumbai).',
    time: 'Oct 5, 2026',
    group: 'Earlier this month',
    unread: false
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>(INITIAL_CUSTOMER_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'quote' | 'booking' | 'chat' | 'system'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const toggleReadStatus = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeTab !== 'all' && item.category !== activeTab) {
        if (activeTab === 'quote' && item.category !== 'quote') return false;
        if (activeTab === 'booking' && item.category !== 'booking') return false;
        if (activeTab === 'chat' && item.category !== 'chat') return false;
        if (activeTab === 'system' && item.category !== 'system' && item.category !== 'review') return false;
      }
      if (showUnreadOnly && !item.unread) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesProvider = item.providerName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesProvider) return false;
      }
      return true;
    });
  }, [notifications, activeTab, showUnreadOnly, searchQuery]);

  const groups = useMemo(() => {
    const list = ['Today', 'Yesterday', 'Earlier this month'] as const;
    return list
      .map((groupName) => ({
        group: groupName,
        items: filteredNotifications.filter((n) => n.group === groupName)
      }))
      .filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  const getIconClass = (category: CustomerNotificationItem['category']) => {
    switch (category) {
      case 'quote':
        return { icon: 'fas fa-file-invoice-dollar', className: 'icon-quote' };
      case 'booking':
        return { icon: 'fas fa-calendar-check', className: 'icon-booking' };
      case 'chat':
        return { icon: 'fas fa-comment-dots', className: 'icon-chat' };
      case 'review':
        return { icon: 'fas fa-star', className: 'icon-review' };
      case 'system':
      default:
        return { icon: 'fas fa-shield-alt', className: 'icon-system' };
    }
  };

  return (
    <div className="app-content customer-notif-container">
      <div className="notif-header-banner">
        <div className="notif-title-group">
          <h1>
            Notifications & Alerts
            {unreadCount > 0 && <span className="notif-meta-pill">{unreadCount} New</span>}
          </h1>
          <p>Real-time updates on quotes, bookings, job milestones, and messages.</p>
        </div>
        <div className="notif-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary text-xs" onClick={markAllAsRead}>
              <i className="fas fa-check-double mr-1"></i> Mark All as Read
            </button>
          )}
          <Link to="/settings" className="btn btn-outline text-xs" title="Notification Preferences">
            <i className="fas fa-sliders-h mr-1"></i> Preferences
          </Link>
        </div>
      </div>

      <div className="notif-toolbar-card">
        <div className="notif-tab-group">
          <button
            className={`notif-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="tab-badge">{notifications.length}</span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'quote' ? 'active' : ''}`}
            onClick={() => setActiveTab('quote')}
          >
            Quotes & Bids
            <span className="tab-badge">
              {notifications.filter((n) => n.category === 'quote').length}
            </span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            Bookings & Jobs
            <span className="tab-badge">
              {notifications.filter((n) => n.category === 'booking').length}
            </span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Messages
            <span className="tab-badge">
              {notifications.filter((n) => n.category === 'chat').length}
            </span>
          </button>
          <button
            className={`notif-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
        </div>

        <div className="notif-controls">
          <div className="notif-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Filter alerts..."
              className="notif-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            className={`notif-unread-switch ${showUnreadOnly ? 'active' : ''}`}
            onClick={() => setShowUnreadOnly((prev) => !prev)}
          >
            <i className={`fas ${showUnreadOnly ? 'fa-dot-circle' : 'fa-circle'}`}></i>
            Unread
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="notif-empty-state">
          <div className="empty-icon-circle">
            <i className="fas fa-bell-slash"></i>
          </div>
          <h3>No notifications found</h3>
          <p>
            {showUnreadOnly || searchQuery
              ? 'Try relaxing your search terms or toggling the unread filter.'
              : "You're all caught up! New quotations, booking updates, and chat messages will appear here."}
          </p>
          {(showUnreadOnly || searchQuery || activeTab !== 'all') && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setActiveTab('all');
                setShowUnreadOnly(false);
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        groups.map(({ group, items }) => (
          <div key={group} className="notif-group-card">
            <div className="notif-group-header">
              <span>{group}</span>
              <span className="text-muted">{items.length} alert{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="notif-list">
              {items.map((item) => {
                const { icon, className } = getIconClass(item.category);
                return (
                  <div key={item.id} className={`notif-item ${item.unread ? 'unread' : ''}`}>
                    <div className={`notif-type-icon ${className}`}>
                      <i className={icon}></i>
                    </div>

                    <div className="notif-content-col">
                      <div className="notif-headline">
                        <div className="notif-title">
                          {item.title}
                          {item.providerName && (
                            <> • <span className="text-primary font-semibold">{item.providerName}</span></>
                          )}
                        </div>
                        <span className="notif-time">{item.time}</span>
                      </div>

                      <p className="notif-desc">{item.subtitle}</p>

                      <div className="notif-actions">
                        {item.primaryAction && (
                          <Link to={item.primaryAction.link} className="btn btn-primary btn-xs">
                            {item.primaryAction.label}
                          </Link>
                        )}
                        {item.secondaryAction && (
                          <Link to={item.secondaryAction.link} className="btn btn-secondary btn-xs">
                            {item.secondaryAction.label}
                          </Link>
                        )}
                      </div>
                    </div>

                    <div className="notif-item-trailing">
                      {item.unread && <span className="unread-dot" title="Unread alert"></span>}
                      <div className="notif-quick-actions">
                        <button
                          className="btn-icon-subtle"
                          title={item.unread ? 'Mark as read' : 'Mark as unread'}
                          onClick={() => toggleReadStatus(item.id)}
                        >
                          <i className={`fas ${item.unread ? 'fa-envelope-open' : 'fa-envelope'}`}></i>
                        </button>
                        <button
                          className="btn-icon-subtle text-danger"
                          title="Dismiss"
                          onClick={() => removeNotification(item.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
