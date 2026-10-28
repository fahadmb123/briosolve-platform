import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './Notifications.css';

interface ProviderNotificationItem {
  id: string;
  category: 'lead' | 'accepted' | 'booking' | 'finance' | 'review' | 'kyc';
  title: string;
  subtitle: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Earlier this week';
  unread: boolean;
  customerName?: string;
  location?: string;
  distance?: string;
  budget?: string;
  bookingId?: string;
  rating?: number;
  primaryAction?: { label: string; link: string };
  secondaryAction?: { label: string; link: string };
}

const INITIAL_PROVIDER_NOTIFICATIONS: ProviderNotificationItem[] = [
  {
    id: 'pn-1',
    category: 'lead',
    title: 'Urgent Service Lead in Your Radius',
    subtitle: 'Homeowner needs "Main Distribution Board Tripping & Wiring Leakage Repair". 3 pros already quoting.',
    time: '12m ago',
    group: 'Today',
    unread: true,
    customerName: 'Priya Nambiar',
    location: 'Kodungallur Market Rd',
    distance: '3.4 km away',
    budget: '₹2,500 - ₹4,000',
    primaryAction: { label: 'Submit Quotation', link: '#' },
    secondaryAction: { label: 'Decline', link: '#' }
  },
  {
    id: 'pn-2',
    category: 'accepted',
    title: 'Quotation Accepted! 🎉',
    subtitle: 'Vikram Menon accepted your ₹3,500 quotation for "Kitchen Exhaust Duct Cleaning & Fan Repair".',
    time: '45m ago',
    group: 'Today',
    unread: true,
    customerName: 'Vikram Menon',
    bookingId: '#BK-9912',
    primaryAction: { label: 'View Booking Details', link: '#' },
    secondaryAction: { label: 'Call Customer', link: '#' }
  },
  {
    id: 'pn-3',
    category: 'booking',
    title: 'Reminder: Scheduled Job at 3:00 PM',
    subtitle: 'Water Tank Float Valve replacement with Ananya Rao (Thrissur West). Remember to verify OTP upon arrival.',
    time: '2h ago',
    group: 'Today',
    unread: false,
    customerName: 'Ananya Rao',
    bookingId: '#BK-8804',
    primaryAction: { label: 'Start Travel / Navigate', link: '#' }
  },
  {
    id: 'pn-4',
    category: 'finance',
    title: 'Weekly Payout Deposited • ₹8,450',
    subtitle: 'Direct NEFT payout for completed jobs #BK-8720, #BK-8755 was sent to your registered HDFC account ending 4102.',
    time: 'Yesterday, 5:30 PM',
    group: 'Yesterday',
    unread: false,
    primaryAction: { label: 'View Statement', link: '#' }
  },
  {
    id: 'pn-5',
    category: 'review',
    title: 'New 5-Star Review Received ⭐⭐⭐⭐⭐',
    subtitle: '"Arrived promptly, explained the pipe issue clearly and left the work area clean. Highly recommended technician!"',
    time: 'Yesterday, 1:15 PM',
    group: 'Yesterday',
    unread: false,
    customerName: 'Deepak Varma',
    rating: 5,
    primaryAction: { label: 'Send Thank You Note', link: '#' }
  },
  {
    id: 'pn-6',
    category: 'kyc',
    title: 'Level 3 Pro Badge Activated',
    subtitle: 'Your trade qualification and police clearance verification passed successfully. You now rank higher in local search leads.',
    time: 'Oct 24, 2026',
    group: 'Earlier this week',
    unread: false,
    primaryAction: { label: 'View Pro Profile', link: '/provider/profile' }
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<ProviderNotificationItem[]>(INITIAL_PROVIDER_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'lead' | 'booking' | 'finance' | 'review'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const leadsCount = useMemo(
    () => notifications.filter((n) => n.category === 'lead').length,
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
      if (activeTab !== 'all') {
        if (activeTab === 'lead' && item.category !== 'lead') return false;
        if (activeTab === 'booking' && item.category !== 'booking' && item.category !== 'accepted') return false;
        if (activeTab === 'finance' && item.category !== 'finance') return false;
        if (activeTab === 'review' && item.category !== 'review' && item.category !== 'kyc') return false;
      }
      if (showUnreadOnly && !item.unread) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
        const matchesCustomer = item.customerName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesSubtitle && !matchesCustomer) return false;
      }
      return true;
    });
  }, [notifications, activeTab, showUnreadOnly, searchQuery]);

  const groups = useMemo(() => {
    const list = ['Today', 'Yesterday', 'Earlier this week'] as const;
    return list
      .map((groupName) => ({
        group: groupName,
        items: filteredNotifications.filter((n) => n.group === groupName)
      }))
      .filter((g) => g.items.length > 0);
  }, [filteredNotifications]);

  const getIconConfig = (category: ProviderNotificationItem['category']) => {
    switch (category) {
      case 'lead':
        return { icon: 'fas fa-search-dollar', className: 'pro-icon-lead' };
      case 'accepted':
        return { icon: 'fas fa-check-circle', className: 'pro-icon-accepted' };
      case 'booking':
        return { icon: 'fas fa-calendar-check', className: 'pro-icon-booking' };
      case 'finance':
        return { icon: 'fas fa-wallet', className: 'pro-icon-finance' };
      case 'review':
        return { icon: 'fas fa-star', className: 'pro-icon-review' };
      case 'kyc':
      default:
        return { icon: 'fas fa-shield-alt', className: 'pro-icon-kyc' };
    }
  };

  return (
    <div className="app-content provider-notif-container">
      <div className="pro-notif-header">
        <div className="pro-header-info">
          <h1>
            <i className="fas fa-bell text-primary"></i>
            Pro Activity & Lead Alerts
            <span className="pro-badge-pill">PRO DISPATCH</span>
          </h1>
          <p>Instant alerts for matching customer leads, booking milestones, payouts, and client feedback.</p>
        </div>
        <div className="pro-header-actions">
          {unreadCount > 0 && (
            <button className="btn btn-secondary text-xs" onClick={markAllAsRead}>
              <i className="fas fa-check-double mr-1"></i> Mark All as Read
            </button>
          )}
          <Link to="/provider/settings" className="btn btn-outline text-xs">
            <i className="fas fa-cog mr-1"></i> Alert Settings
          </Link>
        </div>
      </div>

      <div className="pro-stat-strip">
        <div className="pro-stat-card">
          <div className="pro-stat-icon bg-primary-light text-primary">
            <i className="fas fa-bolt"></i>
          </div>
          <div className="pro-stat-data">
            <div className="val">{leadsCount}</div>
            <div className="lbl">Live Leads in Area</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon bg-success-light text-success">
            <i className="fas fa-check-double"></i>
          </div>
          <div className="pro-stat-data">
            <div className="val">2</div>
            <div className="lbl">Quotes Accepted</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon bg-info-light text-info">
            <i className="fas fa-rupee-sign"></i>
          </div>
          <div className="pro-stat-data">
            <div className="val">₹8,450</div>
            <div className="lbl">Recent Payout</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon bg-warning-light text-warning">
            <i className="fas fa-star"></i>
          </div>
          <div className="pro-stat-data">
            <div className="val">4.9 ★</div>
            <div className="lbl">Pro Rating Score</div>
          </div>
        </div>
      </div>

      <div className="pro-filter-toolbar">
        <div className="pro-tab-list">
          <button
            className={`pro-tab-item ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Alerts <span className="pro-badge-counter">{notifications.length}</span>
          </button>
          <button
            className={`pro-tab-item ${activeTab === 'lead' ? 'active' : ''}`}
            onClick={() => setActiveTab('lead')}
          >
            New Leads (Radius)
            <span className="pro-badge-counter">
              {notifications.filter((n) => n.category === 'lead').length}
            </span>
          </button>
          <button
            className={`pro-tab-item ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => setActiveTab('booking')}
          >
            Bookings & Quotes
            <span className="pro-badge-counter">
              {notifications.filter((n) => n.category === 'booking' || n.category === 'accepted').length}
            </span>
          </button>
          <button
            className={`pro-tab-item ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            Payouts & Finance
          </button>
          <button
            className={`pro-tab-item ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            Reviews & Badges
          </button>
        </div>

        <div className="notif-controls">
          <div className="notif-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Filter pro alerts..."
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
            Unread ({unreadCount})
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="notif-empty-state">
          <div className="empty-icon-circle">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>No provider alerts found</h3>
          <p>
            {showUnreadOnly || searchQuery
              ? 'No notifications match the active filter criteria.'
              : 'Your dispatcher queue is clear! New quote requests and booking alerts will appear here in real-time.'}
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
          <div key={group} className="pro-notif-section">
            <div className="pro-notif-section-title">
              <span>{group}</span>
              <span className="text-muted">{items.length} update{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="pro-notif-list">
              {items.map((item) => {
                const { icon, className } = getIconConfig(item.category);
                return (
                  <div key={item.id} className={`pro-notif-row ${item.unread ? 'unread' : ''}`}>
                    <div className={`notif-type-icon ${className}`}>
                      <i className={icon}></i>
                    </div>

                    <div className="notif-content-col">
                      <div className="notif-headline">
                        <div className="notif-title">
                          {item.title}
                          {item.customerName && (
                            <> • <span className="text-primary">{item.customerName}</span></>
                          )}
                        </div>
                        <span className="notif-time">{item.time}</span>
                      </div>

                      <p className="notif-desc">{item.subtitle}</p>

                      {(item.distance || item.budget || item.location || item.bookingId) && (
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {item.distance && (
                            <span className="lead-meta-pill highlight">
                              <i className="fas fa-map-marker-alt"></i> {item.distance}
                            </span>
                          )}
                          {item.location && (
                            <span className="lead-meta-pill">
                              📍 {item.location}
                            </span>
                          )}
                          {item.budget && (
                            <span className="lead-meta-pill">
                              Budget: <strong className="pro-notif-budget ml-1">{item.budget}</strong>
                            </span>
                          )}
                          {item.bookingId && (
                            <span className="lead-meta-pill">
                              Booking Ref: <strong className="text-text ml-1">{item.bookingId}</strong>
                            </span>
                          )}
                        </div>
                      )}

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
