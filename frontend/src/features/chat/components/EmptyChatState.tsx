import React from "react";
import { Link } from "react-router-dom";

interface EmptyChatStateProps {
  currentRole?: "CUSTOMER" | "PROVIDER";
}

export const EmptyChatState: React.FC<EmptyChatStateProps> = ({
  currentRole = "CUSTOMER",
}) => {
  const isProvider = currentRole === "PROVIDER";

  return (
    <div className="chat-empty-panel">
      <div className="chat-empty-illustration-circle">
        <i className="fas fa-comments" />
      </div>
      <h3 className="chat-empty-main-title">
        {isProvider ? "Select a Client Conversation" : "Select a Conversation"}
      </h3>
      <p className="chat-empty-main-desc">
        {isProvider
          ? "Choose a discussion from the sidebar to chat with customers, submit verified quotations, and schedule on-site service appointments."
          : "Choose a discussion with a service provider from the sidebar to review quotations, coordinate timings, and track service progress."}
      </p>
      <div className="chat-empty-actions-row">
        {isProvider ? (
          <>
            <Link to="/provider/service-requests" className="chat-empty-btn primary">
              <i className="fas fa-search-dollar" />
              <span>Browse Service Requests</span>
            </Link>
            <Link to="/provider/dashboard" className="chat-empty-btn secondary">
              <i className="fas fa-chart-pie" />
              <span>Go to Dashboard</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/my-requests" className="chat-empty-btn primary">
              <i className="fas fa-clipboard-list" />
              <span>View My Requests</span>
            </Link>
            <Link to="/nearby-providers" className="chat-empty-btn secondary">
              <i className="fas fa-search-location" />
              <span>Find Nearby Specialists</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
