import React from "react";
import type { CustomerServiceRequestItem } from "../../../types/serviceRequest.types";

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
    <div className="myreq-stats-grid">
      <div className="myreq-stat-card">
        <div className="myreq-stat-icon-wrapper total">
          <i className="fas fa-clipboard-list"></i>
        </div>
        <div className="myreq-stat-info">
          <span className="myreq-stat-label">Total Requests</span>
          <span className="myreq-stat-value">{totalCount}</span>
        </div>
      </div>

      <div className="myreq-stat-card">
        <div className="myreq-stat-icon-wrapper pending">
          <i className="fas fa-hourglass-half"></i>
        </div>
        <div className="myreq-stat-info">
          <span className="myreq-stat-label">Pending / Matching</span>
          <span className="myreq-stat-value">{pendingCount}</span>
        </div>
      </div>

      <div className="myreq-stat-card">
        <div className="myreq-stat-icon-wrapper in-progress">
          <i className="fas fa-tools"></i>
        </div>
        <div className="myreq-stat-info">
          <span className="myreq-stat-label">In Progress</span>
          <span className="myreq-stat-value">{inProgressCount}</span>
        </div>
      </div>

      <div className="myreq-stat-card">
        <div className="myreq-stat-icon-wrapper completed">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="myreq-stat-info">
          <span className="myreq-stat-label">Completed</span>
          <span className="myreq-stat-value">{completedCount}</span>
        </div>
      </div>
    </div>
  );
};

