import React, { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";
import type { ActiveCallModalProps } from "../types/call-ui.types";
import "./communication-call.css";

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  isOpen,
  serverUrl,
  roomToken,
  callType,
  remoteParticipant,
  onEndCall,
  isMicMuted = false,
  isCameraOff = false,
  onToggleMic,
  onToggleCamera
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(remoteParticipant.name)}&background=05AD98&color=fff`;

  return (
    <div className="comm-call-overlay" role="dialog" aria-modal="true" aria-label="Active Call">
      <div className="comm-active-call-modal">
        <div className="comm-active-call-header">
          <div className="flex items-center gap-3">
            <span className="comm-status-dot" />
            <span className="font-semibold text-sm">{remoteParticipant.name}</span>
            <span className="text-xs text-slate-400 capitalize">({callType} call)</span>
          </div>
          <div className="text-sm font-mono tracking-wider font-semibold text-emerald-400">
            {formatTimer(seconds)}
          </div>
        </div>

        <div className="comm-active-call-body">
          {serverUrl && roomToken ? (
            <LiveKitRoom
              video={callType === "video"}
              audio={true}
              token={roomToken}
              serverUrl={serverUrl}
              data-lk-theme="default"
              style={{ height: "100%", width: "100%" }}
              onDisconnected={onEndCall}
            >
              <VideoConference />
            </LiveKitRoom>
          ) : (
            <div className="comm-audio-call-stage">
              <img
                src={remoteParticipant.avatar || defaultAvatar}
                alt={remoteParticipant.name}
                className="comm-audio-avatar"
              />
              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{remoteParticipant.name}</h4>
                <p className="text-xs text-emerald-400 mt-1">Connected</p>
              </div>
              <div className="comm-audio-waves">
                <span className="comm-wave-bar" />
                <span className="comm-wave-bar" />
                <span className="comm-wave-bar" />
                <span className="comm-wave-bar" />
                <span className="comm-wave-bar" />
              </div>
            </div>
          )}
        </div>

        {(!serverUrl || !roomToken) && (
          <div className="comm-active-controls-bar">
            {onToggleMic && (
              <button
                type="button"
                onClick={onToggleMic}
                className={`comm-control-btn ${isMicMuted ? "active-off" : ""}`}
                title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                aria-label={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                <i className={isMicMuted ? "fas fa-microphone-slash" : "fas fa-microphone"} />
              </button>
            )}

            {callType === "video" && onToggleCamera && (
              <button
                type="button"
                onClick={onToggleCamera}
                className={`comm-control-btn ${isCameraOff ? "active-off" : ""}`}
                title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                aria-label={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                <i className={isCameraOff ? "fas fa-video-slash" : "fas fa-video"} />
              </button>
            )}

            <button
              type="button"
              onClick={onEndCall}
              className="comm-control-btn end-call"
              title="End Call"
              aria-label="End Call"
            >
              <i className="fas fa-phone-slash" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

