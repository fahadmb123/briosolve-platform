import React, { useState, useEffect } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useLocalParticipant,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import type { ActiveCallModalProps } from "../types/call-ui.types";
import "./communication-call.css";

interface ActiveCallStageProps {
  remoteParticipant: ActiveCallModalProps["remoteParticipant"];
  defaultAvatar: string;
  initialCallType: ActiveCallModalProps["callType"];
}

const ActiveCallStage: React.FC<ActiveCallStageProps> = ({
  remoteParticipant,
  defaultAvatar,
  initialCallType,
}) => {
  const { isCameraEnabled } = useLocalParticipant();
  const cameraTracks = useTracks([Track.Source.Camera]);

  const hasVideo = initialCallType === "video" || isCameraEnabled || cameraTracks.length > 0;

  if (hasVideo) {
    return <VideoConference />;
  }

  return (
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
  );
};

interface LiveKitCallControlsProps {
  onEndCall: () => void;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
}

const LiveKitCallControls: React.FC<LiveKitCallControlsProps> = ({
  onEndCall,
  onToggleMic,
  onToggleCamera,
}) => {
  const { isMicrophoneEnabled, isCameraEnabled, localParticipant } = useLocalParticipant();

  const handleToggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
      onToggleMic?.();
    }
  };

  const handleToggleCamera = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
      onToggleCamera?.();
    }
  };

  return (
    <div className="comm-active-controls-bar">
      <button
        type="button"
        onClick={handleToggleMic}
        className={`comm-control-btn ${!isMicrophoneEnabled ? "active-off" : ""}`}
        title={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
        aria-label={isMicrophoneEnabled ? "Mute Microphone" : "Unmute Microphone"}
      >
        <i className={isMicrophoneEnabled ? "fas fa-microphone" : "fas fa-microphone-slash"} />
      </button>

      <button
        type="button"
        onClick={handleToggleCamera}
        className={`comm-control-btn ${!isCameraEnabled ? "active-off" : ""}`}
        title={isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
        aria-label={isCameraEnabled ? "Turn Camera Off" : "Turn Camera On"}
      >
        <i className={isCameraEnabled ? "fas fa-video" : "fas fa-video-slash"} />
      </button>

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
  );
};

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  isOpen,
  serverUrl,
  roomToken,
  callType,
  remoteParticipant,
  onEndCall,
  onToggleMic,
  onToggleCamera,
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
  const roleLabel =
    remoteParticipant.role === "PROVIDER"
      ? "Provider"
      : remoteParticipant.role === "CUSTOMER"
        ? "Customer"
        : "Member";

  return (
    <div className="comm-call-overlay" role="dialog" aria-modal="true" aria-label="Active Call">
      <div className="comm-active-call-modal">
        {serverUrl && roomToken ? (
          <LiveKitRoom
            video={callType === "video"}
            audio={true}
            token={roomToken}
            serverUrl={serverUrl}
            data-lk-theme="default"
            style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column" }}
            onDisconnected={onEndCall}
          >
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
              <ActiveCallStage
                remoteParticipant={remoteParticipant}
                defaultAvatar={defaultAvatar}
                initialCallType={callType}
              />
            </div>

            <LiveKitCallControls
              onEndCall={onEndCall}
              onToggleMic={onToggleMic}
              onToggleCamera={onToggleCamera}
            />
          </LiveKitRoom>
        ) : (
          <>
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
            </div>

            <div className="comm-active-controls-bar">
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
          </>
        )}
      </div>
    </div>
  );
};
