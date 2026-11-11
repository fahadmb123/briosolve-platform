import React, { useState, useEffect } from "react";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
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
  const roleLabel = remoteParticipant.role === "PROVIDER" ? "Provider" : remoteParticipant.role === "CUSTOMER" ? "Customer" : "Member";

  return (
    <div className="comm-call-overlay" role="dialog" aria-modal="true" aria-label="Active Call">
      <div className="comm-active-call-modal">
        <div className="comm-active-call-header">
          <div className="comm-header-left-info">
            <img
              src={remoteParticipant.avatar || defaultAvatar}
              alt={remoteParticipant.name}
              className="comm-header-avatar"
            />
            <div className="flex items-center">
              <span className="comm-header-name">{remoteParticipant.name}</span>
              <span className="comm-header-role-chip">{roleLabel}</span>
            </div>
          </div>

          <div className="comm-timer-pill">
            <span className="comm-status-dot" />
            <span>{formatTimer(seconds)}</span>
          </div>

          <div className="comm-header-right-badges">
            <span className="comm-security-pill">
              <i className="fas fa-lock" /> Encrypted
            </span>
            <button
              type="button"
              onClick={onEndCall}
              className="comm-control-btn active-off"
              style={{ width: 34, height: 34, fontSize: "0.85rem" }}
              title="Leave call"
              aria-label="Leave call"
            >
              <i className="fas fa-phone-slash" />
            </button>
          </div>
        </div>

        <div className="comm-active-call-body">
          {serverUrl && roomToken ? (
            <LiveKitRoom
              video={callType === "video" && !isCameraOff}
              audio={!isMicMuted}
              token={roomToken}
              serverUrl={serverUrl}
              data-lk-theme="default"
              style={{ height: "100%", width: "100%" }}
              onDisconnected={onEndCall}
            >
              {callType === "video" ? (
                <VideoConference />
              ) : (
                <>
                  <RoomAudioRenderer />
                  <div className="comm-audio-call-stage">
                    <div className="comm-audio-stage-glow" />
                    <div className="comm-audio-avatar-wrap">
                      <div className="comm-audio-speaking-ring" />
                      <img
                        src={remoteParticipant.avatar || defaultAvatar}
                        alt={remoteParticipant.name}
                        className="comm-audio-avatar"
                      />
                    </div>
                    <div className="comm-audio-participant-info">
                      <h4 className="comm-audio-name">{remoteParticipant.name}</h4>
                      <div className="comm-audio-status-chip">
                        <i className="fas fa-volume-up" />
                        <span>HD Audio Connected</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </LiveKitRoom>
          ) : (
            <div className="comm-audio-call-stage">
              <div className="comm-audio-stage-glow" />
              <div className="comm-audio-avatar-wrap">
                <img
                  src={remoteParticipant.avatar || defaultAvatar}
                  alt={remoteParticipant.name}
                  className="comm-audio-avatar"
                />
              </div>
              <div className="comm-audio-participant-info">
                <h4 className="comm-audio-name">{remoteParticipant.name}</h4>
                <div className="comm-audio-status-chip">
                  <span className="comm-status-dot" />
                  <span>Connecting Live Room...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {callType === "audio" && (
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

            {onToggleCamera && (
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
              className="comm-end-call-btn"
              title="End Call"
              aria-label="End Call"
            >
              <i className="fas fa-phone-slash" />
              <span>End Call</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
