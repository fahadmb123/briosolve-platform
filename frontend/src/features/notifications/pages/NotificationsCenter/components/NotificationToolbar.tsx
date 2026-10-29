import React from "react";
import type {
  NotificationCategoryTab,
  UnifiedNotificationItem,
} from "../../../types/notification.types";

interface NotificationToolbarProps {
  categories: NotificationCategoryTab[];
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showUnreadOnly: boolean;
  onToggleUnreadOnly: () => void;
  unifiedNotifications: UnifiedNotificationItem[];
}

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  categories,
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  showUnreadOnly,
  onToggleUnreadOnly,
  unifiedNotifications,
}) => {
  return (
    <div className="notif-toolbar-card">
      <div className="notif-tab-group">
        {categories.map((cat) => {
          const count =
            cat.id === "all"
              ? unifiedNotifications.length
              : unifiedNotifications.filter((n) => n.category === cat.id).length;

          return (
            <button
              key={cat.id}
              className={`notif-tab-btn ${activeTab === cat.id ? "active" : ""}`}
              onClick={() => onSelectTab(cat.id)}
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="notif-search-clear"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <button
          type="button"
          className={`notif-unread-switch ${showUnreadOnly ? "active" : ""}`}
          onClick={onToggleUnreadOnly}
        >
          <i
            className={`fas ${showUnreadOnly ? "fa-dot-circle" : "fa-circle"}`}
          ></i>
          <span>Unread Only</span>
        </button>
      </div>
    </div>
  );
};

