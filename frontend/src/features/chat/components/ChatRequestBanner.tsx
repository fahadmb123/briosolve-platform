import React from "react";
import { Link } from "react-router-dom";
import type { ChatLinkedRequest } from "../types/chat.types";

interface ChatRequestBannerProps {
  request: ChatLinkedRequest;
  currentRole?: "CUSTOMER" | "PROVIDER";
  onOpenDetails: () => void;
}

export const ChatRequestBanner: React.FC<ChatRequestBannerProps> = ({
  request,
  currentRole = "CUSTOMER",
  onOpenDetails,
}) => {
  const requestsRoute =
    currentRole === "PROVIDER" ? "/provider/service-requests" : "/my-requests";

  return (
    <div className="chat-request-banner">
      <div className="chat-banner-left">
        <div className="chat-banner-icon-box">
          <i className="fas fa-clipboard-list" />
        </div>
        <div className="chat-banner-info">
          <div className="chat-banner-headline-row">
            <span className="chat-banner-title">{request.title}</span>
            <span className="chat-banner-badge">{request.categoryName}</span>
          </div>
          <div className="chat-banner-meta-row">
            <span>
              <i className="far fa-clock" /> {request.urgency.replace("_", " ")}
            </span>
            <span className="chat-banner-bullet">•</span>
            <span>
              <i className="fas fa-wallet" />{" "}
              {request.budgetType === "FIXED" && request.budgetAmount
                ? `₹${request.budgetAmount.toLocaleString()}`
                : "Open to Bids"}
            </span>
            <span className="chat-banner-bullet">•</span>
            <span>
              <i className="fas fa-map-marker-alt" /> {request.location}
            </span>
          </div>
        </div>
      </div>

      <div className="chat-banner-right">
        <Link to={requestsRoute} className="chat-banner-btn-outline">
          <span>{currentRole === "PROVIDER" ? "Marketplace Requests" : "My Requests"}</span>
          <i className="fas fa-external-link-alt" />
        </Link>
        <button
          type="button"
          className="chat-banner-btn-primary"
          onClick={onOpenDetails}
        >
          <span>Quick Summary</span>
        </button>
      </div>
    </div>
  );
};
