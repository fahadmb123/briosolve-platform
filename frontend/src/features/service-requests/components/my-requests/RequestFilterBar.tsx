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
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <div className="myreq-filter-strip">
      <div className="myreq-segmented-tabs">
        {tabs.map((tab) => {
          const count = counts[tab.key] || 0;
          const isActive = selectedStatus === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              className={`myreq-segmented-tab ${isActive ? "active" : ""}`}
              onClick={() => onSelectStatus(tab.key)}
            >
              <span>{tab.label}</span>
              <span className="myreq-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="myreq-filter-controls">
        <div className="myreq-search-box">
          <i className="fas fa-search myreq-search-icon"></i>
          <input
            type="text"
            placeholder="Search by title, service, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="myreq-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="myreq-search-clear"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="myreq-sort-box">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOrderType)}
            className="myreq-sort-select"
            aria-label="Sort requests"
          >
            <option value="NEWEST">Newest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
};
