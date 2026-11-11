import React from "react";
import type { OutgoingCallModalProps } from "../types/call-ui.types";
import "./communication-call.css";

export const OutgoingCallModal: React.FC<OutgoingCallModalProps> = ({
  isOpen,
  recipient,
  callType,
  onCancel
}) => {
  if (!isOpen) return null;

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}&background=05AD98&color=fff`;

  return (
    <div className="comm-call-overlay" role="dialog" aria-modal="true" aria-label="Outgoing Call">
      <div className="comm-call-modal-card">
        <div className="comm-avatar-ring-wrap">
          <div className="comm-pulse-ring" />
          <div className="comm-pulse-ring-delayed" />
          <img
            src={recipient.avatar || defaultAvatar}
            alt={recipient.name}
            className="comm-call-avatar"
          />
        </div>

        <h3 className="comm-call-title">{recipient.name}</h3>
        <p className="comm-call-subtitle">
          <i className={callType === "video" ? "fas fa-video" : "fas fa-phone-alt"} />
          <span>Calling ({callType === "video" ? "Video" : "Audio"})...</span>
        </p>

        <div className="comm-call-actions-row">
          <div className="comm-action-btn-label">
            <button
              type="button"
              onClick={onCancel}
              className="comm-action-btn-circle comm-btn-cancel"
              aria-label="Cancel Call"
            >
              <i className="fas fa-phone-slash" />
            </button>
            <span>Cancel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

