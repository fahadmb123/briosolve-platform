import React from "react";

export type NotificationFilterTab = "all" | "unread";

interface NotificationToolbarProps {
  activeTab: NotificationFilterTab;
  onSelectTab: (tab: NotificationFilterTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  unreadCount: number;
}

export const NotificationToolbar: React.FC<NotificationToolbarProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  totalCount,
  unreadCount,
}) => {
  return (
    <div className="notif-toolbar-card">
      <div className="notif-tab-group">
        <button
          type="button"
          className={`notif-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => onSelectTab("all")}
        >
          <span>All</span>
          <span className="notif-tab-badge">{totalCount}</span>
        </button>

        <button
          type="button"
          className={`notif-tab-btn ${activeTab === "unread" ? "active" : ""}`}
          onClick={() => onSelectTab("unread")}
        >
          <span>Unread</span>
          <span className="notif-tab-badge">{unreadCount}</span>
        </button>
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
      </div>
    </div>
  );
};
