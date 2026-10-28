import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AdminPageHeader } from '../../../admin/components/AdminPageHeader';
import './Notifications.css';

interface AdminNotificationItem {
  id: string;
  category: 'kyc' | 'reactivation' | 'dispute' | 'system' | 'catalog';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  time: string;
  group: 'Today' | 'Yesterday' | 'Earlier this week';
  unread: boolean;
  entityId?: string;
  entityType?: string;
  primaryAction?: { label: string; link: string };
  secondaryAction?: { label: string; link: string };
}

const INITIAL_ADMIN_NOTIFICATIONS: AdminNotificationItem[] = [
  {
    id: 'an-1',
    category: 'dispute',
    severity: 'critical',
    title: 'Escalated Customer Dispute #DSP-304',
    description: 'Booking #BK-1049 reported for incomplete plumbing work & damaged pipe joint. ₹3,200 payment hold triggered.',
    time: '15m ago',
    group: 'Today',
    unread: true,
    entityId: '#DSP-304',
    entityType: 'Dispute',
    primaryAction: { label: 'Open Investigation', link: '#' },
    secondaryAction: { label: 'Contact Parties', link: '#' }
  },
  {
    id: 'an-2',
    category: 'kyc',
    severity: 'warning',
    title: 'New Provider Verification Documents',
    description: 'Royal Electrical Solutions submitted Trade License, GSTIN & Aadhaar for Level 2 Verified Pro status.',
    time: '35m ago',
    group: 'Today',
    unread: true,
    entityId: '#KYC-7821',
    entityType: 'Verification',
    primaryAction: { label: 'Review KYC Docs', link: '/admin/verification' },
    secondaryAction: { label: 'Assign Reviewer', link: '#' }
  },
  {
    id: 'an-3',
    category: 'reactivation',
    severity: 'warning',
    title: 'Account Reactivation Requested',
    description: 'Deactivated provider "SafeVolt Air Conditioning" completed OTP verification and requested account restoration.',
    time: '2h ago',
    group: 'Today',
    unread: true,
    entityId: '#RCT-4402',
    entityType: 'Reactivation',
    primaryAction: { label: 'Inspect Reactivation', link: '/admin/reactivations' }
  },
  {
    id: 'an-4',
    category: 'system',
    severity: 'critical',
    title: 'High Failed Authentication Spike',
    description: 'Multiple consecutive failed admin portal login attempts detected originating from unknown external IP (194.26.29.11).',
    time: 'Yesterday, 9:20 PM',
    group: 'Yesterday',
    unread: false,
    entityType: 'Security Log',
    primaryAction: { label: 'View Audit Logs', link: '#' },
    secondaryAction: { label: 'Block IP Range', link: '#' }
  },
  {
    id: 'an-5',
    category: 'catalog',
    severity: 'info',
    title: 'Catalog Suggestion: "Solar Inverter Service"',
    description: '6 verified electricians in Ernakulam/Thrissur submitted requests to add "Solar Panel & Inverter Servicing" to catalog.',
    time: 'Yesterday, 3:45 PM',
    group: 'Yesterday',
    unread: false,
    entityType: 'Catalog',
    primaryAction: { label: 'Manage Categories', link: '/admin/categories' }
  },
  {
    id: 'an-6',
    category: 'system',
    severity: 'success',
    title: 'Nightly Database Backup & Integrity Check',
    description: 'PostgreSQL automated replication backup completed successfully. 0 integrity anomalies reported across 11 namespaces.',
    time: 'Oct 26, 2026',
    group: 'Earlier this week',
    unread: false,
    entityType: 'System'
  }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<AdminNotificationItem[]>(INITIAL_ADMIN_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'kyc' | 'reactivation' | 'dispute' | 'system'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  const criticalCount = useMemo(
    () => notifications.filter((n) => n.severity === 'critical' && n.unread).length,
    [notifications]
  );

  const kycCount = useMemo(
    () => notifications.filter((n) => n.category === 'kyc' && n.unread).length,
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
        if (activeTab === 'kyc' && item.category !== 'kyc') return false;
        if (activeTab === 'reactivation' && item.category !== 'reactivation') return false;
        if (activeTab === 'dispute' && item.category !== 'dispute') return false;
        if (activeTab === 'system' && item.category !== 'system' && item.category !== 'catalog') return false;
      }
      if (showUnreadOnly && !item.unread) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesEntity = item.entityId?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesEntity) return false;
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

  const getCategoryIcon = (category: AdminNotificationItem['category']) => {
    switch (category) {
      case 'kyc':
        return { icon: 'fas fa-user-check', className: 'admin-icon-kyc' };
      case 'reactivation':
        return { icon: 'fas fa-user-shield', className: 'admin-icon-reactivation' };
      case 'dispute':
        return { icon: 'fas fa-gavel', className: 'admin-icon-dispute' };
      case 'catalog':
        return { icon: 'fas fa-th-large', className: 'admin-icon-catalog' };
      case 'system':
      default:
        return { icon: 'fas fa-server', className: 'admin-icon-system' };
    }
  };

  return (
    <div className="app-content admin-notif-container">
      <AdminPageHeader
        title="Platform Governance & System Alerts"
        description="Monitor real-time compliance events, provider verifications, account reactivations, and security anomalies."
      />

      <div className="admin-severity-summary">
        <div className="severity-card critical">
          <div className="severity-icon bg-danger-light text-danger">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="severity-info">
            <div className="val">{criticalCount}</div>
            <div className="lbl">Critical Incidents</div>
          </div>
        </div>

        <div className="severity-card warning">
          <div className="severity-icon bg-warning-light text-warning">
            <i className="fas fa-id-card"></i>
          </div>
          <div className="severity-info">
            <div className="val">{kycCount}</div>
            <div className="lbl">Pending Verifications</div>
          </div>
        </div>

        <div className="severity-card info">
          <div className="severity-icon bg-info-light text-info">
            <i className="fas fa-bell"></i>
          </div>
          <div className="severity-info">
            <div className="val">{unreadCount}</div>
            <div className="lbl">Unread Notifications</div>
          </div>
        </div>

        <div className="severity-card success">
          <div className="severity-icon bg-success-light text-success">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="severity-info">
            <div className="val">Operational</div>
            <div className="lbl">System Health</div>
          </div>
        </div>
      </div>

      <div className="admin-notif-toolbar">
        <div className="admin-tab-group">
          <button
            className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Alerts <span className="admin-badge-count">{notifications.length}</span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            KYC Verification
            <span className="admin-badge-count">
              {notifications.filter((n) => n.category === 'kyc').length}
            </span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'reactivation' ? 'active' : ''}`}
            onClick={() => setActiveTab('reactivation')}
          >
            Reactivations
            <span className="admin-badge-count">
              {notifications.filter((n) => n.category === 'reactivation').length}
            </span>
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'dispute' ? 'active' : ''}`}
            onClick={() => setActiveTab('dispute')}
          >
            Disputes & Fraud
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System & Catalog
          </button>
        </div>

        <div className="notif-controls">
          <div className="notif-search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search admin alerts..."
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

          {unreadCount > 0 && (
            <button className="btn btn-secondary btn-sm" onClick={markAllAsRead}>
              <i className="fas fa-check-double mr-1"></i> Acknowledge All
            </button>
          )}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="notif-empty-state">
          <div className="empty-icon-circle">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>No governance alerts found</h3>
          <p>
            {showUnreadOnly || searchQuery
              ? 'No alerts match your current filter parameters.'
              : 'All systems are normal. No pending disputes or flagged anomalies in the governance queue.'}
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
          <div key={group} className="admin-notif-section">
            <div className="admin-section-header">
              <span>{group}</span>
              <span className="text-muted">{items.length} incident{items.length > 1 ? 's' : ''}</span>
            </div>
            <div className="admin-notif-list">
              {items.map((item) => {
                const { icon, className } = getCategoryIcon(item.category);
                return (
                  <div key={item.id} className={`admin-notif-row ${item.unread ? 'unread' : ''}`}>
                    <div className={`notif-type-icon ${className}`}>
                      <i className={icon}></i>
                    </div>

                    <div className="notif-content-col">
                      <div className="notif-headline">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`severity-pill ${item.severity}`}>
                            {item.severity === 'critical' && <span className="pulse-dot"></span>}
                            {item.severity}
                          </span>
                          <span className="notif-title">{item.title}</span>
                        </div>
                        <span className="notif-time">{item.time}</span>
                      </div>

                      <p className="notif-desc">{item.description}</p>

                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        {item.entityId && (
                          <span className="admin-meta-chip">
                            <strong>Ref:</strong> {item.entityId}
                          </span>
                        )}
                        {item.entityType && (
                          <span className="admin-meta-chip">
                            <i className="fas fa-tag"></i> {item.entityType}
                          </span>
                        )}
                      </div>

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
                      {item.unread && <span className="unread-dot" title="Unread event"></span>}
                      <div className="notif-quick-actions">
                        <button
                          className="btn-icon-subtle"
                          title={item.unread ? 'Mark as reviewed' : 'Mark as unread'}
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
