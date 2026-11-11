import React from "react";
import { useCallStore } from "../stores/call.store";
import { IncomingCallModal } from "./IncomingCallModal";
import { OutgoingCallModal } from "./OutgoingCallModal";
import { ActiveCallModal } from "./ActiveCallModal";

export const CallModalContainer: React.FC = () => {
  const {
    status,
    callType,
    participant,
    serverUrl,
    roomToken,
    isMicMuted,
    isCameraOff,
    acceptCall,
    endCall,
    toggleMic,
    toggleCamera,
  } = useCallStore();

  if (status === "idle" || !participant) return null;

  return (
    <>
      {status === "ringing" && (
        <IncomingCallModal
          isOpen={true}
          caller={participant}
          callType={callType}
          onAccept={() => acceptCall()}
          onDecline={endCall}
        />
      )}

      {status === "calling" && (
        <OutgoingCallModal
          isOpen={true}
          recipient={participant}
          callType={callType}
          onCancel={endCall}
        />
      )}

      {status === "connected" && (
        <ActiveCallModal
          isOpen={true}
          serverUrl={serverUrl}
          roomToken={roomToken}
          callType={callType}
          remoteParticipant={participant}
          onEndCall={endCall}
          isMicMuted={isMicMuted}
          isCameraOff={isCameraOff}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
        />
      )}
    </>
  );
};

