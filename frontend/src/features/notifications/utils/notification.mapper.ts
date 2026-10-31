import {
    NOTIFICATION_ROUTES,
    type UserRole,
    type NotificationResponseDto,
    type HeaderNotification,
    type UnifiedNotificationItem,
    type NotificationTimeGroup,
    type NotificationAction,
} from "../types/notification.types";

const TIME_THRESHOLDS = {
    MINUTE_SECONDS: 60,
    HOUR_SECONDS: 3600,
    DAY_SECONDS: 86400,
    MILLISECONDS_PER_DAY: 86400000,
    WEEK_DAYS: 7,
} as const;

const NOTIFICATION_ICON_THEMES = {
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

export function formatRelativeTime(date: Date): string {
    const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 1000),
    );

    if (elapsedSeconds < TIME_THRESHOLDS.MINUTE_SECONDS) {
        return "Just now";
    }
    if (elapsedSeconds < TIME_THRESHOLDS.HOUR_SECONDS) {
        return `${Math.floor(elapsedSeconds / TIME_THRESHOLDS.MINUTE_SECONDS)}m ago`;
    }
    if (elapsedSeconds < TIME_THRESHOLDS.DAY_SECONDS) {
        return `${Math.floor(elapsedSeconds / TIME_THRESHOLDS.HOUR_SECONDS)}h ago`;
    }
    return `${Math.floor(elapsedSeconds / TIME_THRESHOLDS.DAY_SECONDS)}d ago`;
}

export function mapNotificationToHeader(
    notification: NotificationResponseDto,
    role: UserRole,
): HeaderNotification {
    const createdAt = new Date(notification.created_at);
    const theme = NOTIFICATION_ICON_THEMES[notification.type];

    return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time: formatRelativeTime(createdAt),
        unread: !notification.is_read,
        icon: theme.icon,
        iconColor: theme.iconColor,
        iconBg: theme.iconBg,
        link: NOTIFICATION_ROUTES[role] || NOTIFICATION_ROUTES.CUSTOMER,
    };
}

export function mapNotificationToUnified(
    notification: NotificationResponseDto,
    role: UserRole,
): UnifiedNotificationItem {
    const createdAt = new Date(notification.created_at);
    const now = new Date();

    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(
        startOfToday.getTime() - TIME_THRESHOLDS.MILLISECONDS_PER_DAY,
    );
    const startOfWeek = new Date(
        startOfToday.getTime() -
            TIME_THRESHOLDS.WEEK_DAYS * TIME_THRESHOLDS.MILLISECONDS_PER_DAY,
    );

    let group: NotificationTimeGroup;
    if (createdAt >= startOfToday) {
        group = "Today";
    } else if (createdAt >= startOfYesterday) {
        group = "Yesterday";
    } else if (createdAt >= startOfWeek) {
        group = "Earlier this week";
    } else {
        group = "Earlier this month";
    }

    const theme = NOTIFICATION_ICON_THEMES[notification.type];
    const content = `${notification.title} ${notification.message}`.toLowerCase();
    let category = "system";
    let primaryAction: NotificationAction | undefined;

    if (role === "CUSTOMER") {
        if (
            content.includes("quote") ||
            content.includes("bid") ||
            content.includes("estimate")
        ) {
            category = "quote";
            primaryAction = {
                label: "View Quotes",
                link: "/quotes",
                icon: "fa-file-invoice-dollar",
                variant: "primary",
            };
        } else if (
            content.includes("booking") ||
            content.includes("job") ||
            content.includes("appointment") ||
            content.includes("service")
        ) {
            category = "booking";
            primaryAction = {
                label: "View Bookings",
                link: "/bookings",
                icon: "fa-calendar-check",
                variant: "primary",
            };
        } else if (content.includes("message") || content.includes("chat")) {
            category = "chat";
        } else {
            category = "system";
        }
    } else if (role === "PROVIDER") {
        if (
            content.includes("lead") ||
            content.includes("request") ||
            content.includes("nearby")
        ) {
            category = "lead";
            primaryAction = {
                label: "View Leads",
                link: "/provider/leads",
                icon: "fa-bolt",
                variant: "primary",
            };
        } else if (
            content.includes("accepted") ||
            content.includes("quote") ||
            content.includes("awarded")
        ) {
            category = "accepted";
            primaryAction = {
                label: "View Quotes",
                link: "/provider/quotes",
                icon: "fa-check-double",
                variant: "primary",
            };
        } else if (
            content.includes("booking") ||
            content.includes("job") ||
            content.includes("appointment")
        ) {
            category = "booking";
            primaryAction = {
                label: "View Schedule",
                link: "/provider/bookings",
                icon: "fa-calendar",
                variant: "primary",
            };
        } else if (
            content.includes("payment") ||
            content.includes("payout") ||
            content.includes("finance") ||
            content.includes("wallet")
        ) {
            category = "finance";
        } else if (
            content.includes("review") ||
            content.includes("rating") ||
            content.includes("feedback")
        ) {
            category = "review";
        } else {
            category = "lead";
        }
    } else if (role === "ADMIN") {
        if (
            content.includes("kyc") ||
            content.includes("verification") ||
            content.includes("document")
        ) {
            category = "kyc";
            primaryAction = {
                label: "Review KYC",
                link: "/admin/verifications",
                icon: "fa-id-card",
                variant: "primary",
            };
        } else if (
            content.includes("reactivat") ||
            content.includes("suspend") ||
            content.includes("block") ||
            content.includes("active") ||
            content.includes("status") ||
            content.includes("user")
        ) {
            category = "reactivation";
            primaryAction = {
                label: "View Users",
                link: "/admin/users",
                icon: "fa-users",
                variant: "primary",
            };
        } else if (
            content.includes("dispute") ||
            content.includes("conflict") ||
            content.includes("complaint")
        ) {
            category = "dispute";
        } else if (
            content.includes("catalog") ||
            content.includes("proposal") ||
            content.includes("category")
        ) {
            category = "catalog";
            primaryAction = {
                label: "View Catalog",
                link: "/admin/catalog",
                icon: "fa-book-open",
                variant: "primary",
            };
        } else {
            category = "system";
        }
    }

    return {
        id: notification.id,
        role,
        category,
        title: notification.title,
        subtitle: notification.message,
        time: formatRelativeTime(createdAt),
        group,
        unread: !notification.is_read,
        icon: theme.icon,
        iconColor: theme.iconColor,
        iconBg: theme.iconBg,
        badgeType: theme.badgeType,
        primaryAction,
    };
}
