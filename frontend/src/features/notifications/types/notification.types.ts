export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type NotificationType =
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR";

export type NotificationTimeGroup =
    | "Today"
    | "Yesterday"
    | "Earlier this week"
    | "Earlier this month";

export const NOTIFICATION_ROUTES = {
    CUSTOMER: "/notifications",
    PROVIDER: "/provider/notifications",
    ADMIN: "/admin/notifications",
} as const;

export const MAX_DROPDOWN_BADGE_COUNT = 9;

export const TIME_GROUPS: NotificationTimeGroup[] = [
    "Today",
    "Yesterday",
    "Earlier this week",
    "Earlier this month",
];

export interface NotificationResponseDto {
    id: string;
    recipient_id: string;
    type: NotificationType;
    title: string;
    message: string;
    is_read: boolean;
    read_at: Date | null;
    created_at: Date;
}

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

export interface NotificationDropdownProps {
    role?: UserRole;
    viewAllLink?: string;
}

export interface NotificationAction {
    label: string;
    link: string;
    icon?: string;
    variant?: "primary" | "secondary" | "outline" | "danger";
}

export interface NotificationMetaTag {
    label?: string;
    value: string;
    icon?: string;
}

export interface UnifiedNotificationItem {
    id: string;
    role: UserRole;
    category: string;
    title: string;
    subtitle: string;
    time: string;
    group: NotificationTimeGroup;
    unread: boolean;
    icon: string;
    iconColor: string;
    iconBg: string;
    badgeLabel?: string;
    badgeType?: "primary" | "success" | "warning" | "danger" | "info";
    metaTags?: NotificationMetaTag[];
    primaryAction?: NotificationAction;
    secondaryAction?: NotificationAction;
}

export interface NotificationStatCard {
    id: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    value: string | number;
    label: string;
}

export interface RoleNotificationConfig {
    headerTitle: string;
    headerIcon: string;
    headerSubtitle: string;
    settingsLink: string;
    settingsLabel: string;
    badgePillText?: string;
    getStats: (notifications: UnifiedNotificationItem[], unreadCount: number) => NotificationStatCard[];
}

export const ROLE_CONFIGS: Record<UserRole, RoleNotificationConfig> = {
    CUSTOMER: {
        headerTitle: "Notifications & Activity",
        headerIcon: "fa-bell",
        headerSubtitle:
            "Real-time updates on quotations, service bookings, milestone status, and provider messages.",
        settingsLink: "/settings",
        settingsLabel: "Alert Preferences",
        badgePillText: "CUSTOMER PORTAL",
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
