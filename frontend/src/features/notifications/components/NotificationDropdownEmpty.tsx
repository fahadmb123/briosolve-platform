import React from "react";

interface NotificationDropdownEmptyProps {
  activeTab: "all" | "unread";
}

export const NotificationDropdownEmpty: React.FC<NotificationDropdownEmptyProps> = ({
  activeTab,
}) => {
  return (
    <div className="notif-empty-state">
      <div className="notif-empty-icon">
        <i className="fas fa-bell-slash"></i>
      </div>

      <p className="font-semibold text-text text-sm mb-1">
        {activeTab === "unread"
          ? "No unread notifications"
          : "No notifications yet"}
      </p>

      <p className="text-xs text-secondary mb-0">
        {activeTab === "unread"
          ? "Great job! You have read all your latest updates."
          : "New activity, quotes, and messages will appear here."}
      </p>
    </div>
  );
};

