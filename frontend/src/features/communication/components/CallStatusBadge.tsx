import React from "react";
import type { CallStatusBadgeProps } from "../types/call-ui.types";
import "./communication-call.css";

export const CallStatusBadge: React.FC<CallStatusBadgeProps> = ({
  participantName,
  callType,
  duration,
  onExpand,
  onEndCall,
  className = ""
}) => {
  return (
    <div className={`comm-status-badge ${className}`}>
      <span className="comm-status-dot" />
      <span className="truncate max-w-[120px]">
        {participantName} ({callType})
      </span>
      {duration && <span className="font-mono">{duration}</span>}

      {onExpand && (
        <button
          type="button"
          onClick={onExpand}
          className="hover:text-white transition-colors"
          title="Return to call"
          aria-label="Return to call"
        >
          <i className="fas fa-expand-alt text-xs" />
        </button>
      )}

      {onEndCall && (
        <button
          type="button"
          onClick={onEndCall}
          className="text-red-400 hover:text-red-300 transition-colors ml-1"
          title="Hang up"
          aria-label="Hang up"
        >
          <i className="fas fa-phone-slash text-xs" />
        </button>
      )}
    </div>
  );
};

