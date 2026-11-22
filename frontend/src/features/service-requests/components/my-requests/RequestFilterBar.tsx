import React from "react";
import type { ServiceRequestStatus } from "../../types/serviceRequest.types";

export type StatusFilterType = "ALL" | ServiceRequestStatus;

export type SortOrderType = "NEWEST" | "OLDEST";

interface RequestFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: StatusFilterType;
  onSelectStatus: (status: StatusFilterType) => void;
  sortBy: SortOrderType;
  onSortChange: (sort: SortOrderType) => void;
  counts: Record<StatusFilterType, number>;
}

export const RequestFilterBar: React.FC<RequestFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
  sortBy,
  onSortChange,
  counts,
}) => {
  const tabs: { key: StatusFilterType; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "ACTIVE", label: "Active" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CLOSED", label: "Closed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="myreq-filter-bar-container">
      <div className="myreq-status-tabs-list" role="tablist">
        {tabs.map((tab) => {
          const count = counts[tab.key] || 0;
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`myreq-status-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectStatus(tab.key)}
            >
              <span className="myreq-tab-label">{tab.label}</span>
              <span className={`myreq-tab-bubble ${count > 0 ? "has-items" : ""}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="myreq-search-sort-group">
        <div className="myreq-search-field-wrapper">
          <i className="fas fa-search myreq-search-prefix-icon"></i>
          <input
            type="text"
            placeholder="Search by title, service, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="myreq-search-text-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="myreq-search-reset-btn"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="myreq-sort-dropdown-wrapper">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOrderType)}
            className="myreq-sort-select-input"
            aria-label="Sort service requests"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
          <i className="fas fa-chevron-down myreq-sort-chevron"></i>
        </div>
      </div>
    </div>
  );
};
