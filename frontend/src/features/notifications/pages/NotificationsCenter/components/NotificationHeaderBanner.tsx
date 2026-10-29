import React from "react";
import { Link } from "react-router-dom";
import type { RoleNotificationConfig } from "../../../types/notification.types";

interface NotificationHeaderBannerProps {
  config: RoleNotificationConfig;
  unreadCount: number;
  onMarkAllAsRead: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NotificationHeaderBanner: React.FC<NotificationHeaderBannerProps> = ({
  config,
  unreadCount,
  onMarkAllAsRead,
}) => {
  return (
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
          <button className="btn btn-secondary text-xs" onClick={onMarkAllAsRead}>
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
  );
};

