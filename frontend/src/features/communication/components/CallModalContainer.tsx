import React, { useEffect, useRef } from "react";
import { useCallStore } from "../stores/call.store";
import { IncomingCallModal } from "./IncomingCallModal";
import { OutgoingCallModal } from "./OutgoingCallModal";
import { ActiveCallModal } from "./ActiveCallModal";
import { socket } from "../../../shared/api/socket-client";
import { fetchCallToken, recordCallMessage } from "../api/call.api";
import { useAuthStore } from "../../auth/stores/auth.store";
import {
  startCallingSound,
  startIncomingRingSound,
  stopCallSounds,
  playCallEndSound,
} from "../utils/call-sound.utils";

export const CallModalContainer: React.FC = () => {
  const {
    status,
    callType,
    participant,
    serverUrl,
    roomToken,
    roomName,
    isMicMuted,
    isCameraOff,
    acceptCall,
    endCall,
    receiveIncomingCall,
    toggleMic,
    toggleCamera,
  } = useCallStore();

  const currentUser = useAuthStore((state) => state.user);
  const pendingTokenRef = useRef<{ serverUrl?: string; token?: string }>({});
  const prevStatusRef = useRef(status);
  const connectedAtRef = useRef<number | null>(null);

  useEffect(() => {
    const handleIncoming = (data: {
      callerId: string;
      callerName: string;
      callerAvatar?: string;
      roomName: string;
      callType: "audio" | "video";
      conversationId?: string;
    }) => {
      receiveIncomingCall(
        {
          id: data.callerId,
          name: data.callerName,
          avatar: data.callerAvatar,
        },
        data.callType,
        data.roomName,
        data.conversationId
      );
    };

    const handleAccepted = async (data?: { roomName?: string }) => {
      if (pendingTokenRef.current.token && pendingTokenRef.current.serverUrl) {
        acceptCall(pendingTokenRef.current.serverUrl, pendingTokenRef.current.token);
      } else {
        const targetRoom = data?.roomName || useCallStore.getState().roomName;
        if (targetRoom) {
          try {
            const res = await fetchCallToken(
              targetRoom,
              useCallStore.getState().callType,
              useAuthStore.getState().user?.name
            );
            acceptCall(res.serverUrl, res.token);
          } catch {
            endCall();
          }
        }
      }
    };

    const handleRejected = () => {
      const { conversationId, isCaller, callType } = useCallStore.getState();
      if (conversationId && isCaller) {
        recordCallMessage(conversationId, callType, "declined");
      }
      endCall();
    };

    const handleEnded = (data?: { duration?: number }) => {
      const { conversationId, isCaller, callType, status: currentStatus } = useCallStore.getState();
      if (conversationId && isCaller) {
        if (currentStatus === "connected") {
          const duration = data?.duration ?? (connectedAtRef.current ? Math.max(1, Math.round((Date.now() - connectedAtRef.current) / 1000)) : 0);
          recordCallMessage(conversationId, callType, "completed", duration);
        } else {
          recordCallMessage(conversationId, callType, "missed");
        }
      }
      endCall();
    };

    socket.on("call:incoming", handleIncoming);
    socket.on("call:accepted", handleAccepted);
    socket.on("call:rejected", handleRejected);
    socket.on("call:ended", handleEnded);

    return () => {
      socket.off("call:incoming", handleIncoming);
      socket.off("call:accepted", handleAccepted);
      socket.off("call:rejected", handleRejected);
      socket.off("call:ended", handleEnded);
    };
  }, [receiveIncomingCall, acceptCall, endCall]);

  useEffect(() => {
    if (status === "calling") {
      startCallingSound();
    } else if (status === "ringing") {
      startIncomingRingSound();
    } else if (status === "connected") {
      stopCallSounds();
      connectedAtRef.current = Date.now();
    } else {
      stopCallSounds();
      if (prevStatusRef.current === "connected" || prevStatusRef.current === "calling") {
        playCallEndSound();
      }
      connectedAtRef.current = null;
    }
    prevStatusRef.current = status;

    return () => {
      stopCallSounds();
    };
  }, [status]);

  useEffect(() => {
    if (status !== "idle") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [status]);

  useEffect(() => {
    if (status !== "calling" || !participant || !roomName) return;

    let isCancelled = false;

    fetchCallToken(roomName, callType, currentUser?.name)
      .then((res) => {
        if (isCancelled) return;
        pendingTokenRef.current = { serverUrl: res.serverUrl, token: res.token };

        socket.emit("call:initiate", {
          recipientId: participant.id,
          roomName,
          callType,
          callerName: currentUser?.name || "Caller",
          callerAvatar: (currentUser as any)?.profileImage || (currentUser as any)?.customer_profile?.profile_image || (currentUser as any)?.provider_profile?.profile_image,
          conversationId: useCallStore.getState().conversationId
        });
      })
      .catch(() => {
        if (!isCancelled) endCall();
      });

    return () => {
      isCancelled = true;
    };
  }, [status, participant, roomName, callType, currentUser, endCall]);

  const handleAcceptIncoming = async () => {
    if (!roomName || !participant) return;
    try {
      const res = await fetchCallToken(roomName, callType, currentUser?.name);
      socket.emit("call:accept", {
        callerId: participant.id,
        roomName
      });
      acceptCall(res.serverUrl, res.token);
    } catch {
      endCall();
    }
  };

  const handleDeclineIncoming = () => {
    if (participant && roomName) {
      socket.emit("call:reject", {
        callerId: participant.id,
        roomName,
        reason: "declined"
      });
    }
    endCall();
  };

  const handleCancelOutgoing = () => {
    const { conversationId, isCaller, callType, participant, roomName } = useCallStore.getState();
    if (participant && roomName) {
      socket.emit("call:end", {
        targetUserId: participant.id,
        roomName
      });
    }
    if (conversationId && isCaller) {
      recordCallMessage(conversationId, callType, "missed");
    }
    endCall();
  };

  const handleEndActiveCall = () => {
    const { conversationId, isCaller, callType, participant, roomName } = useCallStore.getState();
    const duration = connectedAtRef.current
      ? Math.max(1, Math.round((Date.now() - connectedAtRef.current) / 1000))
      : 0;

    if (participant && roomName) {
      socket.emit("call:end", {
        targetUserId: participant.id,
        roomName,
        duration
      });
    }
    if (conversationId && isCaller) {
      recordCallMessage(conversationId, callType, "completed", duration);
    }
    endCall();
  };

  if (status === "idle" || !participant) return null;

  return (
    <>
      {status === "ringing" && (
        <IncomingCallModal
          isOpen={true}
          caller={participant}
          callType={callType}
          onAccept={handleAcceptIncoming}
          onDecline={handleDeclineIncoming}
        />
      )}

      {status === "calling" && (
        <OutgoingCallModal
          isOpen={true}
          recipient={participant}
          callType={callType}
          onCancel={handleCancelOutgoing}
        />
      )}

      {status === "connected" && (
        <ActiveCallModal
          isOpen={true}
          serverUrl={serverUrl}
          roomToken={roomToken}
          callType={callType}
          remoteParticipant={participant}
          onEndCall={handleEndActiveCall}
          isMicMuted={isMicMuted}
          isCameraOff={isCameraOff}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
        />
      )}
    </>
  );
};
