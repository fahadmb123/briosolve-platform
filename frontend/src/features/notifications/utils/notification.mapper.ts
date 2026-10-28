import type { HeaderNotification } from '../components/NotificationDropdown';
import type { NotificationResponseDto } from '../types/notificastion-response.types';

export function mapNotificationToHeader(
    notification: NotificationResponseDto,
        role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN',
    ): HeaderNotification {
    const createdAt = new Date(notification.created_at);
    const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - createdAt.getTime()) / 1000),
    );

    let time: string;

    if (elapsedSeconds < 60) {
        time = 'Just now';
    } else if (elapsedSeconds < 3600) {
        time = `${Math.floor(elapsedSeconds / 60)}m ago`;
    } else if (elapsedSeconds < 86400) {
        time = `${Math.floor(elapsedSeconds / 3600)}h ago`;
    } else {
        time = `${Math.floor(elapsedSeconds / 86400)}d ago`;
    }

    const iconByType = {
        INFO: {
            icon: 'fa-info-circle',
            iconColor: '#3b82f6',
            iconBg: 'rgba(59, 130, 246, 0.12)',
        },
        SUCCESS: {
            icon: 'fa-check-circle',
            iconColor: '#10b981',
            iconBg: 'rgba(16, 185, 129, 0.12)',
        },
        WARNING: {
            icon: 'fa-exclamation-triangle',
            iconColor: '#d97706',
            iconBg: 'rgba(245, 158, 11, 0.12)',
        },
        ERROR: {
            icon: 'fa-times-circle',
            iconColor: '#ef4444',
            iconBg: 'rgba(239, 68, 68, 0.12)',
        },
    } as const;

    const icon = iconByType[notification.type];

    return {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        time,
        unread: !notification.is_read,
        ...icon,
        link:
            role === 'PROVIDER'
                ? '/provider/notifications'
                : role === 'ADMIN'
                ? '/admin/notifications'
                : '/notifications',
    }
}