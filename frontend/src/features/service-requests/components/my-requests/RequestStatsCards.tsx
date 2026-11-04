import React from "react";
import type { CustomerServiceRequestItem } from "../../types/serviceRequest.types";

interface RequestStatsCardsProps {
  requests: CustomerServiceRequestItem[];
}

export const RequestStatsCards: React.FC<RequestStatsCardsProps> = ({ requests }) => {
  const totalCount = requests.length;
  const pendingCount = requests.filter(
    (r) => r.status === "PENDING" || r.status === "ACTIVE"
  ).length;
  const inProgressCount = requests.filter(
    (r) => r.status === "ACCEPTED" || r.status === "IN_PROGRESS"
  ).length;
  const completedCount = requests.filter((r) => r.status === "COMPLETED").length;

  return (
    <div className="myreq-stats-bar">
      <div className="myreq-stat-cell">
        <div className="myreq-stat-cell-header">
          <span className="myreq-stat-dot total"></span>
          <span className="myreq-stat-name">Total Postings</span>
        </div>
        <span className="myreq-stat-number">{totalCount}</span>
      </div>

      <div className="myreq-stat-divider" />

      <div className="myreq-stat-cell">
        <div className="myreq-stat-cell-header">
          <span className="myreq-stat-dot pending"></span>
          <span className="myreq-stat-name">Awaiting Quotes</span>
        </div>
        <span className="myreq-stat-number">{pendingCount}</span>
      </div>

      <div className="myreq-stat-divider" />

      <div className="myreq-stat-cell">
        <div className="myreq-stat-cell-header">
          <span className="myreq-stat-dot in-progress"></span>
          <span className="myreq-stat-name">In Progress</span>
        </div>
        <span className="myreq-stat-number">{inProgressCount}</span>
      </div>

      <div className="myreq-stat-divider" />

      <div className="myreq-stat-cell">
        <div className="myreq-stat-cell-header">
          <span className="myreq-stat-dot completed"></span>
          <span className="myreq-stat-name">Completed</span>
        </div>
        <span className="myreq-stat-number">{completedCount}</span>
      </div>
    </div>
  );
};
