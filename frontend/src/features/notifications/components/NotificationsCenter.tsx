import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../auth/stores/auth.store";
import type {
    UserRole,
    UnifiedNotificationItem,
} from "../types/notification.types";
import "./NotificationsCenter.css";
import { useNotificationStore } from "../store/notification.store";
import {
    getNotifications,
    markAllNotificationsAsRead,
    updateNotificationStatus,
} from "../services/notification.service";
import { mapNotificationToUnified } from "../utils/notification.mapper";
import { TIME_GROUPS, ROLE_CONFIGS } from "../constants/notification.constants";

export interface NotificationsCenterProps {
    role?: UserRole;
}

export default function NotificationsCenter({ role: propRole }: NotificationsCenterProps) {
    const userRole = useAuthStore((state) => state.user?.role);

    const upperRole = userRole?.toUpperCase();
    const activeRole: UserRole =
        propRole ??
        (upperRole === "ADMIN" || upperRole === "PROVIDER" || upperRole === "CUSTOMER"
            ? (upperRole as UserRole)
            : "CUSTOMER");

    const config = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.CUSTOMER;

    const [activeTab, setActiveTab] = useState<string>("all");
    const [showUnreadOnly, setShowUnreadOnly] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const notifications = useNotificationStore((state) => state.notifications);
    const setNotifications = useNotificationStore((state) => state.setNotifications);
    const updateNotification = useNotificationStore((state) => state.updateNotification);
    const removeNotificationFromStore = useNotificationStore((state) => state.removeNotification);

    useEffect(() => {
        getNotifications()
            .then((res) => {
                if (res.data) {
                    setNotifications(res.data);
                }
            })
            .catch(() => {});
    }, [setNotifications]);

    const unifiedNotifications: UnifiedNotificationItem[] = useMemo(() => {
        return notifications.map((n) => mapNotificationToUnified(n, activeRole));
    }, [notifications, activeRole]);

    const unreadCount = useMemo(
        () => unifiedNotifications.filter((n) => n.unread).length,
        [unifiedNotifications],
    );

    const stats = useMemo(
        () => config.getStats(unifiedNotifications, unreadCount),
        [config, unifiedNotifications, unreadCount],
    );

    const markAllAsRead = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const readAt = new Date();

            notifications.forEach((notification) => {
                if (!notification.is_read) {
                    updateNotification(notification.id, {
                        is_read: true,
                        read_at: readAt,
                    });
                }
            });

            markAllNotificationsAsRead().catch(() => {});
        },
        [notifications, updateNotification],
    );

    const toggleReadStatus = useCallback(
        (id: string) => {
            const target = notifications.find((n) => n.id === id);
            if (!target) return;

            const nextRead = !target.is_read;
            const readAt = nextRead ? new Date() : null;

            updateNotification(id, {
                is_read: nextRead,
                read_at: readAt,
            });

            updateNotificationStatus(id, {
                isRead: nextRead,
                readAt,
            }).catch(() => {});
        },
        [notifications, updateNotification],
    );

    const removeNotification = useCallback(
        (id: string) => {
            removeNotificationFromStore(id);
        },
        [removeNotificationFromStore],
    );

    const filteredNotifications = useMemo(() => {
        return unifiedNotifications.filter((item) => {
            if (activeTab !== "all" && item.category !== activeTab) {
                return false;
            }
            if (showUnreadOnly && !item.unread) {
                return false;
            }
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = item.title.toLowerCase().includes(query);
                const matchesSubtitle = item.subtitle.toLowerCase().includes(query);
                const matchesBadge = item.badgeLabel?.toLowerCase().includes(query) ?? false;
                const matchesMeta = item.metaTags?.some(
                    (tag) =>
                        tag.value.toLowerCase().includes(query) ||
                        tag.label?.toLowerCase().includes(query),
                ) ?? false;

                if (!matchesTitle && !matchesSubtitle && !matchesBadge && !matchesMeta) {
                    return false;
                }
            }
            return true;
        });
    }, [unifiedNotifications, activeTab, showUnreadOnly, searchQuery]);

    const groups = useMemo(() => {
        return TIME_GROUPS.map((groupName) => ({
            group: groupName,
            items: filteredNotifications.filter((n) => n.group === groupName),
        })).filter((g) => g.items.length > 0);
    }, [filteredNotifications]);

    const resetFilters = useCallback(() => {
        setActiveTab("all");
        setShowUnreadOnly(false);
        setSearchQuery("");
    }, []);

    return (
        <div className="app-content notif-center-container">
            <div className="notif-header-banner">
                <div className="notif-title-group">
                    <h1>
                        <span className="notif-header-icon">
                            <i className={`fas ${config.headerIcon}`}></i>
                        </span>
                        <span>{config.headerTitle}</span>
                        {config.badgePillText && (
                            <span className="notif-role-pill">{config.badgePillText}</span>
                        )}
                        {unreadCount > 0 && (
                            <span className="notif-unread-count-pill">
                                <span className="notif-pulse-dot"></span>
                                {unreadCount} Unread
                            </span>
                        )}
                    </h1>
                    <p>{config.headerSubtitle}</p>
                </div>

                <div className="notif-header-actions">
                    {unreadCount > 0 && (
                        <button className="btn btn-secondary text-xs" onClick={markAllAsRead}>
                            <i className="fas fa-check-double mr-1"></i> Mark All as Read
                        </button>
                    )}
                    {config.settingsLink && (
                        <Link to={config.settingsLink} className="btn btn-outline text-xs">
                            <i className="fas fa-sliders-h mr-1"></i> {config.settingsLabel}
                        </Link>
                    )}
                </div>
            </div>

            <div className="notif-stat-strip">
                {stats.map((stat) => (
                    <div key={stat.id} className="notif-stat-card">
                        <div
                            className="notif-stat-icon"
                            style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
                        >
                            <i className={`fas ${stat.icon}`}></i>
                        </div>
                        <div className="notif-stat-data">
                            <div className="notif-stat-val">{stat.value}</div>
                            <div className="notif-stat-lbl">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="notif-toolbar-card">
                <div className="notif-tab-group">
                    {config.categories.map((cat) => {
                        const count =
                            cat.id === "all"
                                ? unifiedNotifications.length
                                : unifiedNotifications.filter((n) => n.category === cat.id).length;

                        return (
                            <button
                                key={cat.id}
                                className={`notif-tab-btn ${activeTab === cat.id ? "active" : ""}`}
                                onClick={() => setActiveTab(cat.id)}
                            >
                                <span>{cat.label}</span>
                                <span className="notif-tab-badge">{count}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="notif-controls">
                    <div className="notif-search-box">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            className="notif-search-input"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="notif-search-clear"
                                onClick={() => setSearchQuery("")}
                                title="Clear search"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className={`notif-unread-switch ${showUnreadOnly ? "active" : ""}`}
                        onClick={() => setShowUnreadOnly((prev) => !prev)}
                    >
                        <i className={`fas ${showUnreadOnly ? "fa-dot-circle" : "fa-circle"}`}></i>
                        <span>Unread Only</span>
                    </button>
                </div>
            </div>

            {groups.length === 0 ? (
                <div className="notif-empty-state">
                    <div className="notif-empty-icon">
                        <i className="fas fa-bell-slash"></i>
                    </div>
                    <h3>No notifications found</h3>
                    <p>
                        {showUnreadOnly || searchQuery || activeTab !== "all"
                            ? "No notifications match your current filter criteria. Try resetting or relaxing your search query."
                            : "You're all caught up! New alerts and activity updates will automatically appear here."}
                    </p>
                    {(showUnreadOnly || searchQuery || activeTab !== "all") && (
                        <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
                            <i className="fas fa-undo mr-1"></i> Reset Filters
                        </button>
                    )}
                </div>
            ) : (
                groups.map(({ group, items }) => (
                    <div key={group} className="notif-group-card">
                        <div className="notif-group-header">
                            <span>{group}</span>
                            <span>
                                {items.length} {items.length === 1 ? "alert" : "alerts"}
                            </span>
                        </div>
                        <div className="notif-list">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`notif-item ${item.unread ? "unread" : ""}`}
                                >
                                    <div
                                        className="notif-type-icon"
                                        style={{
                                            backgroundColor: item.iconBg,
                                            color: item.iconColor,
                                        }}
                                    >
                                        <i className={`fas ${item.icon}`}></i>
                                    </div>

                                    <div className="notif-content-col">
                                        <div className="notif-headline">
                                            <div className="notif-title-row">
                                                <span className="notif-title">{item.title}</span>
                                                {item.badgeLabel && (
                                                    <span
                                                        className={`notif-badge-tag badge-${
                                                            item.badgeType || "primary"
                                                        }`}
                                                    >
                                                        {item.badgeLabel}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="notif-time">{item.time}</span>
                                        </div>

                                        <p className="notif-desc">{item.subtitle}</p>

                                        {item.metaTags && item.metaTags.length > 0 && (
                                            <div className="notif-meta-tags">
                                                {item.metaTags.map((tag, idx) => (
                                                    <div key={idx} className="notif-meta-chip">
                                                        {tag.icon && <i className={`fas ${tag.icon}`}></i>}
                                                        {tag.label && (
                                                            <span className="chip-label">{tag.label}:</span>
                                                        )}
                                                        <span className="chip-value">{tag.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {(item.primaryAction || item.secondaryAction) && (
                                            <div className="notif-actions">
                                                {item.primaryAction &&
                                                    (item.primaryAction.link.startsWith("#") ? (
                                                        <button
                                                            type="button"
                                                            className={`notif-action-btn ${
                                                                item.primaryAction.variant || "primary"
                                                            }`}
                                                        >
                                                            {item.primaryAction.icon && (
                                                                <i className={`fas ${item.primaryAction.icon}`}></i>
                                                            )}
                                                            <span>{item.primaryAction.label}</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            to={item.primaryAction.link}
                                                            className={`notif-action-btn ${
                                                                item.primaryAction.variant || "primary"
                                                            }`}
                                                        >
                                                            {item.primaryAction.icon && (
                                                                <i className={`fas ${item.primaryAction.icon}`}></i>
                                                            )}
                                                            <span>{item.primaryAction.label}</span>
                                                        </Link>
                                                    ))}

                                                {item.secondaryAction &&
                                                    (item.secondaryAction.link.startsWith("#") ? (
                                                        <button
                                                            type="button"
                                                            className={`notif-action-btn ${
                                                                item.secondaryAction.variant || "secondary"
                                                            }`}
                                                        >
                                                            {item.secondaryAction.icon && (
                                                                <i className={`fas ${item.secondaryAction.icon}`}></i>
                                                            )}
                                                            <span>{item.secondaryAction.label}</span>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            to={item.secondaryAction.link}
                                                            className={`notif-action-btn ${
                                                                item.secondaryAction.variant || "secondary"
                                                            }`}
                                                        >
                                                            {item.secondaryAction.icon && (
                                                                <i className={`fas ${item.secondaryAction.icon}`}></i>
                                                            )}
                                                            <span>{item.secondaryAction.label}</span>
                                                        </Link>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="notif-item-trailing">
                                        {item.unread && <span className="unread-dot" title="Unread alert"></span>}
                                        <div className="notif-quick-actions">
                                            <button
                                                type="button"
                                                className="btn-icon-subtle"
                                                title={item.unread ? "Mark as read" : "Mark as unread"}
                                                onClick={() => toggleReadStatus(item.id)}
                                            >
                                                <i
                                                    className={`fas ${
                                                        item.unread ? "fa-envelope-open" : "fa-envelope"
                                                    }`}
                                                ></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-icon-subtle text-danger"
                                                title="Dismiss"
                                                onClick={() => removeNotification(item.id)}
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
