import React from "react";
import { Link } from "react-router-dom";
import type { UnifiedNotificationItem } from "../../../types/notification.types";

interface NotificationItemProps {
  item: UnifiedNotificationItem;
  onToggleRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  item,
  onToggleRead,
  onRemove,
}) => {
  return (
    <div className={`notif-item ${item.unread ? "unread" : ""}`}>
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
        {item.unread && (
          <span className="unread-dot" title="Unread alert"></span>
        )}
        <div className="notif-quick-actions">
          <button
            type="button"
            className="btn-icon-subtle"
            title={item.unread ? "Mark as read" : "Mark as unread"}
            onClick={() => onToggleRead(item.id)}
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
            onClick={() => onRemove(item.id)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

