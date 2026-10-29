import React from "react";
import type { HeaderNotification } from "../types/notification.types";

interface NotificationDropdownItemProps {
  item: HeaderNotification;
  onItemClick: (item: HeaderNotification) => void;
  onToggleRead: (id: string, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NotificationDropdownItem: React.FC<NotificationDropdownItemProps> = ({
  item,
  onItemClick,
  onToggleRead,
}) => {
  return (
    <div
      className={`notif-dropdown-item ${item.unread ? "unread" : "read"}`}
      onClick={() => onItemClick(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onItemClick(item);
        }
      }}
    >
      <div
        className="notif-item-icon-box"
        style={{ backgroundColor: item.iconBg }}
      >
        <i className={`fas ${item.icon}`} style={{ color: item.iconColor }}></i>
      </div>

      <div className="notif-item-content">
        <div className="notif-item-header-row">
          <span className="notif-item-title">{item.title}</span>
          {item.unread && (
            <span className="notif-pulse-dot" title="Unread"></span>
          )}
        </div>

        <p className="notif-item-text">{item.message}</p>

        <div className="notif-item-footer">
          <span className="notif-item-time">
            <i className="far fa-clock text-[10px]"></i>
            <span>{item.time}</span>
          </span>

          <div
            className="notif-item-actions"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-read-toggle"
              onClick={(e) => onToggleRead(item.id, e)}
              title={item.unread ? "Mark as read" : "Mark as unread"}
            >
              <i
                className={`fas ${
                  item.unread ? "fa-check" : "fa-envelope-open"
                }`}
              ></i>
              <span>{item.unread ? "Mark read" : "Unread"}</span>
            </button>

            <button
              type="button"
              className="notif-quick-view-link"
              onClick={() => onItemClick(item)}
            >
              <span>View</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

