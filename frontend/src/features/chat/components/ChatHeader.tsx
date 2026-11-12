import React, { useState } from "react";
import type { ChatParticipant } from "../types/chat.types";

interface ChatHeaderProps {
  participant: ChatParticipant;
  isInfoOpen: boolean;
  onToggleInfo: () => void;
  onBackToMobileList: () => void;
  onStartAudioCall?: () => void;
  onStartVideoCall?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  participant,
  isInfoOpen,
  onToggleInfo,
  onBackToMobileList,
  onStartAudioCall,
  onStartVideoCall,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="chat-main-header">
      <div
        className="chat-header-left"
        onClick={onToggleInfo}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggleInfo();
          }
        }}
        title="View details"
      >
        <button
          type="button"
          className="chat-back-mobile-btn"
          onClick={(e) => {
            e.stopPropagation();
            onBackToMobileList();
          }}
          aria-label="Back to conversations"
        >
          <i className="fas fa-chevron-left" />
        </button>

        <div className="chat-header-avatar-wrap">
          <img
            src={
              participant.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(participant.name)}&background=FF7900&color=fff`
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
          <p className={`chat-header-status-text ${participant.isOnline ? "online" : "offline"}`}>
            {participant.isOnline ? "Active now" : "Offline"}
          </p>
        </div>
      </div>

      <div className="chat-header-actions">
        {onStartAudioCall && (
          <button
            type="button"
            className="chat-action-btn chat-call-btn chat-call-audio-btn"
            onClick={onStartAudioCall}
            title={`Audio call ${participant.name}`}
            aria-label={`Audio call ${participant.name}`}
          >
            <i className="fas fa-phone-alt" />
            <span className="chat-btn-text">Call</span>
          </button>
        )}

        {onStartVideoCall && (
          <button
            type="button"
            className="chat-action-btn chat-call-btn chat-call-video-btn"
            onClick={onStartVideoCall}
            title={`Video call ${participant.name}`}
            aria-label={`Video call ${participant.name}`}
          >
            <i className="fas fa-video" />
            <span className="chat-btn-text">Video</span>
          </button>
        )}

        <button
          type="button"
          className={`chat-action-btn chat-details-btn ${isInfoOpen ? "active" : ""}`}
          onClick={onToggleInfo}
          title="Toggle details"
        >
          <i className="fas fa-info-circle" />
          <span className="chat-btn-text">Details</span>
        </button>

        <div className="chat-dropdown-wrap">
          <button
            type="button"
            className="chat-action-btn icon-only chat-more-btn"
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
