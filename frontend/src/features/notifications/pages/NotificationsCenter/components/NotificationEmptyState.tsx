import React from "react";

interface NotificationEmptyStateProps {
  isFiltered: boolean;
  onResetFilters: () => void;
}

export const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({
  isFiltered,
  onResetFilters,
}) => {
  return (
    <div className="notif-empty-state">
      <div className="notif-empty-icon">
        <i className="fas fa-bell-slash"></i>
      </div>
      <h3>No notifications found</h3>
      <p>
        {isFiltered
          ? "No notifications match your current filter criteria. Try resetting or relaxing your search query."
          : "You're all caught up! New alerts and activity updates will automatically appear here."}
      </p>
      {isFiltered && (
        <button className="btn btn-secondary btn-sm" onClick={onResetFilters}>
          <i className="fas fa-undo mr-1"></i> Reset Filters
        </button>
      )}
    </div>
  );
};

