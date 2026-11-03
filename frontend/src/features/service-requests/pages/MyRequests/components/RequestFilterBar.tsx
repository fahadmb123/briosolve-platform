import React from "react";
import type { ServiceRequestStatus } from "../../../types/serviceRequest.types";

export type StatusFilterType = "ALL" | ServiceRequestStatus;

interface RequestFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStatus: StatusFilterType;
  onSelectStatus: (status: StatusFilterType) => void;
  counts: Record<StatusFilterType, number>;
}

export const RequestFilterBar: React.FC<RequestFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
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
    <div className="myreq-filter-container">
      <div className="myreq-tabs-row">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`myreq-tab-btn ${selectedStatus === tab.key ? "active" : ""}`}
            onClick={() => onSelectStatus(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="myreq-tab-badge">{counts[tab.key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="myreq-search-wrapper">
        <i className="fas fa-search myreq-search-icon"></i>
        <input
          type="text"
          placeholder="Search by title, service, category, or location..."
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
    </div>
  );
};

