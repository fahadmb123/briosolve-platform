import type {
  UnifiedNotificationItem,
  RoleNotificationConfig,
  UserRole
} from '../types/notification.types';

export const INITIAL_CUSTOMER_NOTIFICATIONS: UnifiedNotificationItem[] = [
  {
    id: 'cn-1',
    role: 'CUSTOMER',
    category: 'quote',
    title: 'New Quotation Received',
    subtitle: 'Apex Plumbing Solutions quoted ₹3,200 for "Bathroom Plumbing Repair & Leak Fix". Includes 90-day warranty.',
    time: '20m ago',
    group: 'Today',
    unread: true,
    icon: 'fa-file-invoice-dollar',
    iconColor: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    badgeLabel: 'QUOTE RECEIVED',
    badgeType: 'warning',
    metaTags: [
      { label: 'Pro', value: 'Farhan Ansari', icon: 'fa-user-check' },
      { label: 'Amount', value: '₹3,200', icon: 'fa-tag' }
    ],
    primaryAction: { label: 'View Quotation', link: '#', icon: 'fa-arrow-right' },
    secondaryAction: { label: 'Compare (7)', link: '#' }
  },
  {
    id: 'cn-2',
    role: 'CUSTOMER',
    category: 'chat',
    title: 'New Message from Farhan Ansari',
    subtitle: '"Pressure test is holding up nicely. I have added photos of the replacement valve in our chat."',
    time: '1h ago',
    group: 'Today',
    unread: true,
    icon: 'fa-comment-dots',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    badgeLabel: 'NEW MESSAGE',
    badgeType: 'primary',
    metaTags: [
      { label: 'Sender', value: 'Farhan Ansari', icon: 'fa-user' }
    ],
    primaryAction: { label: 'Reply in Chat', link: '#', icon: 'fa-comments' }
  },
  {
    id: 'cn-3',
    role: 'CUSTOMER',
    category: 'booking',
    title: 'Service Started • Booking #BK-8891',
    subtitle: 'Farhan Ansari arrived on premises in Kodungallur and marked the job milestone as In Progress.',
    time: '3h ago',
    group: 'Today',
    unread: false,
    icon: 'fa-calendar-check',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    badgeLabel: 'JOB IN PROGRESS',
    badgeType: 'success',
    metaTags: [
      { label: 'Booking', value: '#BK-8891', icon: 'fa-hashtag' }
    ],
    primaryAction: { label: 'Track Milestone', link: '#', icon: 'fa-tasks' }
  },
  {
    id: 'cn-4',
    role: 'CUSTOMER',
    category: 'booking',
    title: 'Booking Confirmed with Rajesh Patil',
    subtitle: '"Kitchen Water Purifier Installation" has been locked for Oct 14 at 10:30 AM.',
    time: 'Yesterday, 6:00 PM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-calendar-alt',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    badgeLabel: 'CONFIRMED',
    badgeType: 'success',
    metaTags: [
      { label: 'Technician', value: 'Rajesh Patil', icon: 'fa-user-cog' }
    ],
    primaryAction: { label: 'View Schedule', link: '#' }
  },
  {
    id: 'cn-5',
    role: 'CUSTOMER',
    category: 'review',
    title: 'How was your AC Servicing experience?',
    subtitle: 'Sunil Verma completed your AC foam jet service. Help fellow homeowners by leaving a verified rating.',
    time: 'Yesterday, 11:30 AM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-star',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    badgeLabel: 'SERVICE COMPLETED',
    badgeType: 'info',
    metaTags: [
      { label: 'Provider', value: 'Sunil Verma', icon: 'fa-user' }
    ],
    primaryAction: { label: 'Leave Review', link: '#', icon: 'fa-star' }
  },
  {
    id: 'cn-6',
    role: 'CUSTOMER',
    category: 'system',
    title: 'Security Login Alert',
    subtitle: 'Your customer account was accessed from Chrome on Windows (IP: 103.48.xx.xx, Mumbai).',
    time: 'Oct 5, 2026',
    group: 'Earlier this month',
    unread: false,
    icon: 'fa-shield-alt',
    iconColor: '#64748b',
    iconBg: 'rgba(100, 116, 139, 0.12)',
    badgeLabel: 'SECURITY',
    badgeType: 'info'
  }
];

export const INITIAL_PROVIDER_NOTIFICATIONS: UnifiedNotificationItem[] = [
  {
    id: 'pn-1',
    role: 'PROVIDER',
    category: 'lead',
    title: 'Urgent Service Lead in Your Radius',
    subtitle: 'Homeowner needs "Main Distribution Board Tripping & Wiring Leakage Repair". 3 pros already quoting.',
    time: '12m ago',
    group: 'Today',
    unread: true,
    icon: 'fa-bolt',
    iconColor: '#d97706',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    badgeLabel: 'HOT LEAD',
    badgeType: 'warning',
    metaTags: [
      { label: 'Customer', value: 'Priya Nambiar', icon: 'fa-user' },
      { label: 'Location', value: 'Kodungallur (3.4 km)', icon: 'fa-map-marker-alt' },
      { label: 'Budget', value: '₹2,500 - ₹4,000', icon: 'fa-rupee-sign' }
    ],
    primaryAction: { label: 'Submit Quotation', link: '#', icon: 'fa-paper-plane' },
    secondaryAction: { label: 'Decline', link: '#' }
  },
  {
    id: 'pn-2',
    role: 'PROVIDER',
    category: 'accepted',
    title: 'Quotation Accepted! 🎉',
    subtitle: 'Vikram Menon accepted your ₹3,500 quotation for "Kitchen Exhaust Duct Cleaning & Fan Repair".',
    time: '45m ago',
    group: 'Today',
    unread: true,
    icon: 'fa-check-circle',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    badgeLabel: 'QUOTE ACCEPTED',
    badgeType: 'success',
    metaTags: [
      { label: 'Customer', value: 'Vikram Menon', icon: 'fa-user' },
      { label: 'Booking', value: '#BK-9912', icon: 'fa-hashtag' }
    ],
    primaryAction: { label: 'View Booking Details', link: '#', icon: 'fa-calendar-check' },
    secondaryAction: { label: 'Call Customer', link: '#', icon: 'fa-phone' }
  },
  {
    id: 'pn-3',
    role: 'PROVIDER',
    category: 'booking',
    title: 'Reminder: Scheduled Job at 3:00 PM',
    subtitle: 'Water Tank Float Valve replacement with Ananya Rao (Thrissur West). Remember to verify OTP upon arrival.',
    time: '2h ago',
    group: 'Today',
    unread: false,
    icon: 'fa-clock',
    iconColor: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    badgeLabel: 'SCHEDULED TODAY',
    badgeType: 'info',
    metaTags: [
      { label: 'Client', value: 'Ananya Rao', icon: 'fa-user' },
      { label: 'ID', value: '#BK-8804', icon: 'fa-hashtag' }
    ],
    primaryAction: { label: 'Start Travel / Navigate', link: '#', icon: 'fa-directions' }
  },
  {
    id: 'pn-4',
    role: 'PROVIDER',
    category: 'finance',
    title: 'Weekly Payout Deposited • ₹8,450',
    subtitle: 'Direct NEFT payout for completed jobs #BK-8720, #BK-8755 was sent to your registered HDFC account ending 4102.',
    time: 'Yesterday, 5:30 PM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-wallet',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    badgeLabel: 'PAYOUT PROCESSED',
    badgeType: 'success',
    primaryAction: { label: 'View Statement', link: '#', icon: 'fa-file-invoice' }
  },
  {
    id: 'pn-5',
    role: 'PROVIDER',
    category: 'review',
    title: 'New 5-Star Review Received ⭐⭐⭐⭐⭐',
    subtitle: '"Arrived promptly, explained the pipe issue clearly and left the work area clean. Highly recommended technician!"',
    time: 'Yesterday, 1:15 PM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-star',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    badgeLabel: '5.0 RATING',
    badgeType: 'warning',
    metaTags: [
      { label: 'Customer', value: 'Deepak Varma', icon: 'fa-user' }
    ],
    primaryAction: { label: 'Send Thank You Note', link: '#' }
  },
  {
    id: 'pn-6',
    role: 'PROVIDER',
    category: 'kyc',
    title: 'Level 3 Pro Badge Activated',
    subtitle: 'Your trade qualification and police clearance verification passed successfully. You now rank higher in local search leads.',
    time: 'Oct 24, 2026',
    group: 'Earlier this week',
    unread: false,
    icon: 'fa-shield-alt',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    badgeLabel: 'VERIFIED PRO',
    badgeType: 'primary',
    primaryAction: { label: 'View Pro Profile', link: '/provider/profile' }
  }
];

export const INITIAL_ADMIN_NOTIFICATIONS: UnifiedNotificationItem[] = [
  {
    id: 'an-1',
    role: 'ADMIN',
    category: 'dispute',
    title: 'Escalated Customer Dispute #DSP-304',
    subtitle: 'Booking #BK-1049 reported for incomplete plumbing work & damaged pipe joint. ₹3,200 payment hold triggered.',
    time: '15m ago',
    group: 'Today',
    unread: true,
    icon: 'fa-exclamation-triangle',
    iconColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    badgeLabel: 'CRITICAL DISPUTE',
    badgeType: 'danger',
    metaTags: [
      { label: 'Entity', value: '#DSP-304', icon: 'fa-gavel' }
    ],
    primaryAction: { label: 'Open Investigation', link: '#', icon: 'fa-search' },
    secondaryAction: { label: 'Contact Parties', link: '#' }
  },
  {
    id: 'an-2',
    role: 'ADMIN',
    category: 'kyc',
    title: 'New Provider Verification Documents',
    subtitle: 'Royal Electrical Solutions submitted Trade License, GSTIN & Aadhaar for Level 2 Verified Pro status.',
    time: '35m ago',
    group: 'Today',
    unread: true,
    icon: 'fa-id-card',
    iconColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    badgeLabel: 'PENDING REVIEW',
    badgeType: 'warning',
    metaTags: [
      { label: 'Applicant', value: 'Royal Electrical Solutions', icon: 'fa-building' }
    ],
    primaryAction: { label: 'Review KYC Docs', link: '/admin/verification', icon: 'fa-check' },
    secondaryAction: { label: 'Assign Reviewer', link: '#' }
  },
  {
    id: 'an-3',
    role: 'ADMIN',
    category: 'reactivation',
    title: 'Account Reactivation Requested',
    subtitle: 'Deactivated provider "SafeVolt Air Conditioning" completed OTP verification and requested account restoration.',
    time: '2h ago',
    group: 'Today',
    unread: true,
    icon: 'fa-user-clock',
    iconColor: '#6366f1',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    badgeLabel: 'REACTIVATION',
    badgeType: 'primary',
    metaTags: [
      { label: 'Provider', value: 'SafeVolt Air Conditioning', icon: 'fa-user-shield' }
    ],
    primaryAction: { label: 'Inspect Reactivation', link: '/admin/reactivations' }
  },
  {
    id: 'an-4',
    role: 'ADMIN',
    category: 'system',
    title: 'High Failed Authentication Spike',
    subtitle: 'Multiple consecutive failed admin portal login attempts detected originating from unknown external IP (194.26.29.11).',
    time: 'Yesterday, 9:20 PM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-shield-alt',
    iconColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    badgeLabel: 'SECURITY ALERT',
    badgeType: 'danger',
    primaryAction: { label: 'View Audit Logs', link: '#' },
    secondaryAction: { label: 'Block IP Range', link: '#' }
  },
  {
    id: 'an-5',
    role: 'ADMIN',
    category: 'catalog',
    title: 'Catalog Suggestion: "Solar Inverter Service"',
    subtitle: '6 verified electricians in Ernakulam/Thrissur submitted requests to add "Solar Panel & Inverter Servicing" to catalog.',
    time: 'Yesterday, 3:45 PM',
    group: 'Yesterday',
    unread: false,
    icon: 'fa-th-large',
    iconColor: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    badgeLabel: 'CATALOG PROPOSAL',
    badgeType: 'info',
    primaryAction: { label: 'Manage Categories', link: '/admin/categories' }
  },
  {
    id: 'an-6',
    role: 'ADMIN',
    category: 'system',
    title: 'Nightly Database Backup & Integrity Check',
    subtitle: 'PostgreSQL automated replication backup completed successfully. 0 integrity anomalies reported across 11 namespaces.',
    time: 'Oct 26, 2026',
    group: 'Earlier this week',
    unread: false,
    icon: 'fa-database',
    iconColor: '#10b981',
    iconBg: 'rgba(16, 185, 129, 0.12)',
    badgeLabel: 'SYSTEM HEALTH',
    badgeType: 'success'
  }
];

export const ROLE_CONFIGS: Record<UserRole, RoleNotificationConfig> = {
  CUSTOMER: {
    headerTitle: 'Notifications & Activity',
    headerIcon: 'fa-bell',
    headerSubtitle: 'Real-time updates on quotations, service bookings, milestone status, and provider messages.',
    settingsLink: '/settings',
    settingsLabel: 'Alert Preferences',
    badgePillText: 'CUSTOMER PORTAL',
    categories: [
      { id: 'all', label: 'All Alerts' },
      { id: 'quote', label: 'Quotes & Bids' },
      { id: 'booking', label: 'Bookings & Jobs' },
      { id: 'chat', label: 'Messages' },
      { id: 'system', label: 'System' }
    ],
    getStats: (notifications, unreadCount) => [
      {
        id: 'total',
        icon: 'fa-bell',
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        value: notifications.length,
        label: 'Total Alerts'
      },
      {
        id: 'unread',
        icon: 'fa-envelope',
        iconColor: '#d97706',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        value: unreadCount,
        label: 'Unread Alerts'
      },
      {
        id: 'quotes',
        icon: 'fa-file-invoice-dollar',
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        value: notifications.filter((n) => n.category === 'quote').length,
        label: 'Quotes Received'
      },
      {
        id: 'bookings',
        icon: 'fa-calendar-check',
        iconColor: '#3b82f6',
        iconBg: 'rgba(59, 130, 246, 0.12)',
        value: notifications.filter((n) => n.category === 'booking').length,
        label: 'Active Bookings'
      }
    ]
  },
  PROVIDER: {
    headerTitle: 'Pro Dispatch & Lead Alerts',
    headerIcon: 'fa-bolt',
    headerSubtitle: 'Instant localized lead notifications, quotation updates, customer chats, and payout records.',
    settingsLink: '/provider/settings',
    settingsLabel: 'Dispatch Settings',
    badgePillText: 'PRO DISPATCH',
    categories: [
      { id: 'all', label: 'All Alerts' },
      { id: 'lead', label: 'New Leads' },
      { id: 'accepted', label: 'Accepted Quotes' },
      { id: 'booking', label: 'Bookings' },
      { id: 'finance', label: 'Finances & Payouts' },
      { id: 'review', label: 'Customer Reviews' }
    ],
    getStats: (notifications, unreadCount) => [
      {
        id: 'leads',
        icon: 'fa-bolt',
        iconColor: '#d97706',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        value: notifications.filter((n) => n.category === 'lead').length,
        label: 'Live Leads in Radius'
      },
      {
        id: 'unread',
        icon: 'fa-bell',
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        value: unreadCount,
        label: 'Action Required'
      },
      {
        id: 'accepted',
        icon: 'fa-check-double',
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        value: notifications.filter((n) => n.category === 'accepted').length,
        label: 'Quotes Accepted'
      },
      {
        id: 'rating',
        icon: 'fa-star',
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        value: '4.9 ★',
        label: 'Pro Rating Score'
      }
    ]
  },
  ADMIN: {
    headerTitle: 'Platform Governance & System Alerts',
    headerIcon: 'fa-shield-alt',
    headerSubtitle: 'Monitor real-time compliance events, provider verifications, account reactivations, and security anomalies.',
    settingsLink: '/admin/settings',
    settingsLabel: 'Security Settings',
    badgePillText: 'ADMIN CONTROL',
    categories: [
      { id: 'all', label: 'All Events' },
      { id: 'kyc', label: 'KYC Verifications' },
      { id: 'reactivation', label: 'Reactivations' },
      { id: 'dispute', label: 'Disputes' },
      { id: 'catalog', label: 'Catalog Proposals' },
      { id: 'system', label: 'System Logs' }
    ],
    getStats: (notifications, unreadCount) => [
      {
        id: 'disputes',
        icon: 'fa-exclamation-triangle',
        iconColor: '#ef4444',
        iconBg: 'rgba(239, 68, 68, 0.12)',
        value: notifications.filter((n) => n.category === 'dispute').length,
        label: 'Critical Incidents'
      },
      {
        id: 'kyc',
        icon: 'fa-id-card',
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.12)',
        value: notifications.filter((n) => n.category === 'kyc').length,
        label: 'Pending KYC Docs'
      },
      {
        id: 'reactivations',
        icon: 'fa-user-clock',
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.12)',
        value: notifications.filter((n) => n.category === 'reactivation').length,
        label: 'Reactivation Requests'
      },
      {
        id: 'unread',
        icon: 'fa-bell',
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.12)',
        value: unreadCount,
        label: 'Unread Events'
      }
    ]
  }
};
