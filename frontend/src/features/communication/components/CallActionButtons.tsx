import React from "react";
import type { CallActionButtonsProps } from "../types/call-ui.types";
import "./communication-call.css";

export const CallActionButtons: React.FC<CallActionButtonsProps> = ({
  onStartAudioCall,
  onStartVideoCall,
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`comm-header-action-btns ${className}`}>
      {onStartAudioCall && (
        <button
          type="button"
          onClick={onStartAudioCall}
          disabled={disabled}
          className="comm-header-call-btn"
          title="Start Audio Call"
          aria-label="Start Audio Call"
        >
          <i className="fas fa-phone-alt" />
        </button>
      )}

      {onStartVideoCall && (
        <button
          type="button"
          onClick={onStartVideoCall}
          disabled={disabled}
          className="comm-header-call-btn"
          title="Start Video Call"
          aria-label="Start Video Call"
        >
          <i className="fas fa-video" />
        </button>
      )}
    </div>
  );
};

