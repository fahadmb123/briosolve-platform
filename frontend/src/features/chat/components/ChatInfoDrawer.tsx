import React from "react";
import { Link } from "react-router-dom";
import type { ChatParticipant, ChatLinkedRequest } from "../types/chat.types";

interface ChatInfoDrawerProps {
  participant: ChatParticipant;
  linkedRequest: ChatLinkedRequest;
  currentRole?: "CUSTOMER" | "PROVIDER";
  isOpen: boolean;
  onClose: () => void;
}

export const ChatInfoDrawer: React.FC<ChatInfoDrawerProps> = ({
  participant,
  linkedRequest,
  currentRole = "CUSTOMER",
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const isProvider = currentRole === "PROVIDER";
  const requestsRoute = isProvider ? "/provider/service-requests" : "/my-requests";

  return (
    <aside className="chat-info-sidebar">
      <div className="chat-info-header">
        <h4 className="chat-info-heading">
          {isProvider ? "Client & Request Info" : "Service & Provider Info"}
        </h4>
        <button
          type="button"
          className="chat-info-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          <i className="fas fa-times" />
        </button>
      </div>

      <div className="chat-info-body">
        <div className="chat-info-provider-card">
          <img
            src={
              participant.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=05AD98&color=fff`
            }
            alt={participant.name}
            className="chat-info-avatar"
          />
          <h4 className="chat-info-provider-name">{participant.name}</h4>
          <p className="chat-info-business-title">
            {isProvider
              ? "Verified Client"
              : participant.businessName || "Verified Professional"}
          </p>

          <div className="chat-info-stats-row">
            <div className="chat-info-stat-box">
              <span className="chat-info-stat-value">
                <i className="fas fa-star" /> {participant.rating || "5.0"}
              </span>
              <span className="chat-info-stat-label">
                {participant.reviewsCount || 0} reviews
              </span>
            </div>
            <div className="chat-info-stat-divider" />
            <div className="chat-info-stat-box">
              <span className="chat-info-stat-value">
                {participant.isVerified ? (
                  <span className="text-success font-semibold">
                    <i className="fas fa-shield-alt" /> Verified
                  </span>
                ) : (
                  "Standard"
                )}
              </span>
              <span className="chat-info-stat-label">
                {isProvider ? "Client Trust" : "KYC Badge"}
              </span>
            </div>
          </div>
        </div>

        <div className="chat-info-section">
          <h5 className="chat-info-section-title">
            <i className="fas fa-clipboard-list" /> Linked Service Request
          </h5>
          <div className="chat-info-card-box">
            <span className="chat-info-box-label">Request Title</span>
            <p className="chat-info-box-value">{linkedRequest.title}</p>

            <div className="chat-info-meta-chips-grid">
              <div className="chat-info-meta-item">
                <span className="meta-label">Category</span>
                <span className="meta-value">{linkedRequest.categoryName}</span>
              </div>
              <div className="chat-info-meta-item">
                <span className="meta-label">Timing</span>
                <span className="meta-value">
                  {linkedRequest.urgency.replace("_", " ")}
                </span>
              </div>
              <div className="chat-info-meta-item">
                <span className="meta-label">Budget</span>
                <span className="meta-value">
                  {linkedRequest.budgetType === "FIXED" &&
                  linkedRequest.budgetAmount
                    ? `₹${linkedRequest.budgetAmount.toLocaleString()}`
                    : "Open to Bids"}
                </span>
              </div>
              <div className="chat-info-meta-item">
                <span className="meta-label">Location</span>
                <span className="meta-value">{linkedRequest.location}</span>
              </div>
            </div>

            <Link
              to={requestsRoute}
              className="chat-info-view-full-btn"
            >
              <span>{isProvider ? "View in Service Requests" : "Manage in My Requests"}</span>
              <i className="fas fa-arrow-right" />
            </Link>
          </div>
        </div>

        <div className="chat-info-section">
          <h5 className="chat-info-section-title">
            <i className="fas fa-user-shield" /> Briosolve Trust & Safety
          </h5>
          <div className="chat-safety-box">
            <p className="chat-safety-text">
              {isProvider
                ? "Keep all communications within the platform to maintain your service guarantees and client reviews."
                : "Keep all communication and transactions within Briosolve. Never make off-platform advance wire transfers."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
