import type {
    UserRole,
    NotificationTimeGroup,
    RoleNotificationConfig,
    UnifiedNotificationItem,
} from "../types/notification.types";

export const NOTIFICATION_SOUND_PATH = "/sounds/notification.mp3";

export const MAX_DROPDOWN_BADGE_COUNT = 9;

export const NOTIFICATION_ROUTES = {
    CUSTOMER: "/notifications",
    PROVIDER: "/provider/notifications",
    ADMIN: "/admin/notifications",
} as const;

export const TIME_THRESHOLDS = {
    MINUTE_SECONDS: 60,
    HOUR_SECONDS: 3600,
    DAY_SECONDS: 86400,
    MILLISECONDS_PER_DAY: 86400000,
    WEEK_DAYS: 7,
} as const;

export const NOTIFICATION_ICON_THEMES = {
    INFO: {
        icon: "fa-info-circle",
        iconColor: "#3b82f6",
        iconBg: "rgba(59, 130, 246, 0.12)",
        badgeType: "info" as const,
    },
    SUCCESS: {
        icon: "fa-check-circle",
        iconColor: "#10b981",
        iconBg: "rgba(16, 185, 129, 0.12)",
        badgeType: "success" as const,
    },
    WARNING: {
        icon: "fa-exclamation-triangle",
        iconColor: "#d97706",
        iconBg: "rgba(245, 158, 11, 0.12)",
        badgeType: "warning" as const,
    },
    ERROR: {
        icon: "fa-times-circle",
        iconColor: "#ef4444",
        iconBg: "rgba(239, 68, 68, 0.12)",
        badgeType: "danger" as const,
    },
} as const;

export const TIME_GROUPS: NotificationTimeGroup[] = [
    "Today",
    "Yesterday",
    "Earlier this week",
    "Earlier this month",
];

export const ROLE_CONFIGS: Record<UserRole, RoleNotificationConfig> = {
    CUSTOMER: {
        headerTitle: "Notifications & Activity",
        headerIcon: "fa-bell",
        headerSubtitle:
            "Real-time updates on quotations, service bookings, milestone status, and provider messages.",
        settingsLink: "/settings",
        settingsLabel: "Alert Preferences",
        badgePillText: "CUSTOMER PORTAL",
        categories: [
            { id: "all", label: "All Alerts" },
            { id: "quote", label: "Quotes & Bids" },
            { id: "booking", label: "Bookings & Jobs" },
            { id: "chat", label: "Messages" },
            { id: "system", label: "System" },
        ],
        getStats: (notifications: UnifiedNotificationItem[], unreadCount: number) => [
            {
                id: "total",
                icon: "fa-bell",
                iconColor: "#6366f1",
                iconBg: "rgba(99, 102, 241, 0.12)",
                value: notifications.length,
                label: "Total Alerts",
            },
            {
                id: "unread",
                icon: "fa-envelope",
                iconColor: "#d97706",
                iconBg: "rgba(245, 158, 11, 0.12)",
                value: unreadCount,
                label: "Unread Alerts",
            },
            {
                id: "quotes",
                icon: "fa-file-invoice-dollar",
                iconColor: "#10b981",
                iconBg: "rgba(16, 185, 129, 0.12)",
                value: notifications.filter((n) => n.category === "quote").length,
                label: "Quotes Received",
            },
            {
                id: "bookings",
                icon: "fa-calendar-check",
                iconColor: "#3b82f6",
                iconBg: "rgba(59, 130, 246, 0.12)",
                value: notifications.filter((n) => n.category === "booking").length,
                label: "Active Bookings",
            },
        ],
    },
    PROVIDER: {
        headerTitle: "Pro Dispatch & Lead Alerts",
        headerIcon: "fa-bolt",
        headerSubtitle:
            "Instant localized lead notifications, quotation updates, customer chats, and payout records.",
        settingsLink: "/provider/settings",
        settingsLabel: "Dispatch Settings",
        badgePillText: "PRO DISPATCH",
        categories: [
            { id: "all", label: "All Alerts" },
            { id: "lead", label: "New Leads" },
            { id: "accepted", label: "Accepted Quotes" },
            { id: "booking", label: "Bookings" },
            { id: "finance", label: "Finances & Payouts" },
            { id: "review", label: "Customer Reviews" },
        ],
        getStats: (notifications: UnifiedNotificationItem[], unreadCount: number) => [
            {
                id: "leads",
                icon: "fa-bolt",
                iconColor: "#d97706",
                iconBg: "rgba(245, 158, 11, 0.12)",
                value: notifications.filter((n) => n.category === "lead").length,
                label: "Live Leads",
            },
            {
                id: "unread",
                icon: "fa-bell",
                iconColor: "#6366f1",
                iconBg: "rgba(99, 102, 241, 0.12)",
                value: unreadCount,
                label: "Action Required",
            },
            {
                id: "accepted",
                icon: "fa-check-double",
                iconColor: "#10b981",
                iconBg: "rgba(16, 185, 129, 0.12)",
                value: notifications.filter((n) => n.category === "accepted").length,
                label: "Quotes Accepted",
            },
            {
                id: "total",
                icon: "fa-inbox",
                iconColor: "#3b82f6",
                iconBg: "rgba(59, 130, 246, 0.12)",
                value: notifications.length,
                label: "Total Alerts",
            },
        ],
    },
    ADMIN: {
        headerTitle: "Platform Governance & System Alerts",
        headerIcon: "fa-shield-alt",
        headerSubtitle:
            "Monitor real-time compliance events, provider verifications, account reactivations, and security anomalies.",
        settingsLink: "/admin/settings",
        settingsLabel: "Security Settings",
        badgePillText: "ADMIN CONTROL",
        categories: [
            { id: "all", label: "All Events" },
            { id: "kyc", label: "KYC Verifications" },
            { id: "reactivation", label: "Reactivations" },
            { id: "dispute", label: "Disputes" },
            { id: "catalog", label: "Catalog Proposals" },
            { id: "system", label: "System Logs" },
        ],
        getStats: (notifications: UnifiedNotificationItem[], unreadCount: number) => [
            {
                id: "disputes",
                icon: "fa-exclamation-triangle",
                iconColor: "#ef4444",
                iconBg: "rgba(239, 68, 68, 0.12)",
                value: notifications.filter(
                    (n) => n.badgeType === "danger" || n.category === "dispute",
                ).length,
                label: "Critical Incidents",
            },
            {
                id: "kyc",
                icon: "fa-id-card",
                iconColor: "#f59e0b",
                iconBg: "rgba(245, 158, 11, 0.12)",
                value: notifications.filter((n) => n.category === "kyc").length,
                label: "Pending KYC Docs",
            },
            {
                id: "reactivations",
                icon: "fa-user-clock",
                iconColor: "#6366f1",
                iconBg: "rgba(99, 102, 241, 0.12)",
                value: notifications.filter((n) => n.category === "reactivation").length,
                label: "Reactivation Requests",
            },
            {
                id: "unread",
                icon: "fa-bell",
                iconColor: "#10b981",
                iconBg: "rgba(16, 185, 129, 0.12)",
                value: unreadCount,
                label: "Unread Events",
            },
        ],
    },
};
