import React, { useState } from "react";
import type { ChatParticipant, ChatLinkedRequest } from "../types/chat.types";

interface ChatHeaderProps {
  participant: ChatParticipant;
  linkedRequest?: ChatLinkedRequest;
  currentRole?: "CUSTOMER" | "PROVIDER";
  isInfoOpen: boolean;
  onToggleInfo: () => void;
  onBackToMobileList: () => void;
  onOpenCreateQuote?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  linkedRequest,
  currentRole = "CUSTOMER",
  isInfoOpen,
  onToggleInfo,
  onBackToMobileList,
  onOpenCreateQuote,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="chat-main-header">
      <div className="chat-header-left">
        <button
          type="button"
          className="chat-back-mobile-btn"
          onClick={onBackToMobileList}
          aria-label="Back to conversations"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div className="chat-header-avatar-wrap">
          <img
            src={
              participant.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=05AD98&color=fff`
            }
            alt={participant.name}
            className="chat-header-avatar"
          />
          <span
            className={`chat-presence-dot ${participant.isOnline ? "online" : "offline"}`}
          />
        </div>

        <div className="chat-header-details">
          <div className="chat-header-name-row">
            <h3 className="chat-header-name">{participant.name}</h3>
            {participant.isVerified && (
              <span className="chat-verified-badge" title="Verified Member">
                <i className="fas fa-check-circle" />
              </span>
            )}
            {participant.rating && (
              <span className="chat-rating-tag">
                <i className="fas fa-star" />
                <span>{participant.rating.toFixed(1)}</span>
              </span>
            )}
          </div>
          <p className="chat-header-status-text">
            {participant.isOnline
              ? "Active now"
              : participant.lastSeen
              ? `Last seen ${participant.lastSeen}`
              : participant.businessName || (currentRole === "PROVIDER" ? "Client" : "Service Provider")}
            {linkedRequest && (
              <span className="chat-header-req-tag"> • {linkedRequest.categoryName}</span>
            )}
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        {currentRole === "PROVIDER" && onOpenCreateQuote && (
          <button
            type="button"
            className="chat-action-btn quote-primary"
            onClick={onOpenCreateQuote}
            title="Draft and send an official quote"
          >
            <i className="fas fa-file-invoice-dollar" />
            <span className="chat-btn-text">Send Quote</span>
          </button>
        )}

        {participant.phone && (
          <a
            href={`tel:${participant.phone}`}
            className="chat-action-btn phone"
            title={`Call ${participant.name}`}
          >
            <i className="fas fa-phone-alt" />
            <span className="chat-btn-text">Call</span>
          </a>
        )}

        <button
          type="button"
          className={`chat-action-btn ${isInfoOpen ? "active" : ""}`}
          onClick={onToggleInfo}
          title="Toggle details"
        >
          <i className="fas fa-info-circle" />
          <span className="chat-btn-text">Details</span>
        </button>

        <div className="chat-dropdown-wrap">
          <button
            type="button"
            className="chat-action-btn icon-only"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="More conversation options"
          >
            <i className="fas fa-ellipsis-v" />
          </button>

          {showMenu && (
            <div
              className="chat-context-menu"
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                type="button"
                className="chat-context-item"
                onClick={() => {
                  setShowMenu(false);
                  onToggleInfo();
                }}
              >
                <i className="fas fa-file-alt" />
                <span>View Request Details</span>
              </button>
              <button
                type="button"
                className="chat-context-item"
                onClick={() => setShowMenu(false)}
              >
                <i className="fas fa-shield-alt" />
                <span>Safety & Help</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
