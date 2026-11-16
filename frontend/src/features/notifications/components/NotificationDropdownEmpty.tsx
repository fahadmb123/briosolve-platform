import React from "react";

export const NotificationDropdownEmpty: React.FC = () => {
  return (
    <div className="notif-dropdown-empty-state">
      <img
        src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794747453/notificastion-logo.png"
        alt="No notifications found"
        className="notif-dropdown-empty-img"
      />

      <p className="notif-empty-title">
        No notifications found
      </p>

      <p className="notif-empty-subtitle">
        You have no unread notifications right now.
      </p>
    </div>
  );
};
