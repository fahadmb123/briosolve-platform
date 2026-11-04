import React from "react";
import { Link } from "react-router-dom";

export const EmptyChatState: React.FC = () => {
  return (
    <div className="chat-empty-panel">
      <div className="chat-empty-illustration-circle">
        <i className="fas fa-comments" />
      </div>
      <h3 className="chat-empty-main-title">Select a Conversation</h3>
      <p className="chat-empty-main-desc">
        Choose a discussion with a service provider from the sidebar to review
        quotations, coordinate timings, and track service progress.
      </p>
      <div className="chat-empty-actions-row">
        <Link to="/my-requests" className="chat-empty-btn primary">
          <i className="fas fa-clipboard-list" />
          <span>View My Requests</span>
        </Link>
        <Link to="/nearby-providers" className="chat-empty-btn secondary">
          <i className="fas fa-search-location" />
          <span>Find Nearby Specialists</span>
        </Link>
      </div>
    </div>
  );
};

