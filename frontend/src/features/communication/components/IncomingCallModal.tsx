import React from "react";
import type { IncomingCallModalProps } from "../types/call-ui.types";
import "./communication-call.css";

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  caller,
  callType,
  onAccept,
  onDecline
}) => {
  if (!isOpen) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(caller.name)}&background=05AD98&color=fff`;

  return (
    <div className="comm-call-overlay" role="dialog" aria-modal="true" aria-label="Incoming Call">
      <div className="comm-call-modal-card">
        <div className="comm-avatar-ring-wrap">
          <div className="comm-pulse-ring" />
          <div className="comm-pulse-ring-delayed" />
          <img
            src={caller.avatar || defaultAvatar}
            alt={caller.name}
            className="comm-call-avatar"
          />
        </div>

        <h3 className="comm-call-title">{caller.name}</h3>
        <p className="comm-call-subtitle">
          <i className={callType === "video" ? "fas fa-video" : "fas fa-phone-alt"} />
          <span>Incoming {callType === "video" ? "Video" : "Audio"} Call...</span>
        </p>

        <div className="comm-call-actions-row">
          <div className="comm-action-btn-label">
            <button
              type="button"
              onClick={onDecline}
              className="comm-action-btn-circle comm-btn-decline"
              aria-label="Decline Call"
            >
              <i className="fas fa-phone-slash" />
            </button>
            <span>Decline</span>
          </div>

          <div className="comm-action-btn-label">
            <button
              type="button"
              onClick={onAccept}
              className="comm-action-btn-circle comm-btn-accept"
              aria-label="Accept Call"
            >
              <i className={callType === "video" ? "fas fa-video" : "fas fa-phone-alt"} />
            </button>
            <span>Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

