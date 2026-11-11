import { create } from "zustand";
import type { CallParticipant, CallType, CallStatus } from "../types/call-ui.types";

interface CallState {
  status: CallStatus;
  callType: CallType;
  participant: CallParticipant | null;
  serverUrl?: string;
  roomToken?: string;
  roomName?: string;
  isMicMuted: boolean;
  isCameraOff: boolean;

  startOutgoingCall: (participant: CallParticipant, type: CallType, roomName?: string) => void;
  receiveIncomingCall: (caller: CallParticipant, type: CallType, roomName: string) => void;
  acceptCall: (serverUrl?: string, roomToken?: string) => void;
  endCall: () => void;
  toggleMic: () => void;
  toggleCamera: () => void;
}

export const useCallStore = create<CallState>()((set) => ({
  status: "idle",
  callType: "audio",
  participant: null,
  serverUrl: undefined,
  roomToken: undefined,
  roomName: undefined,
  isMicMuted: false,
  isCameraOff: false,

  startOutgoingCall: (participant, type, roomName) =>
    set({
      status: "calling",
      callType: type,
      participant,
      roomName,
      isMicMuted: false,
      isCameraOff: false,
    }),

  receiveIncomingCall: (caller, type, roomName) =>
    set({
      status: "ringing",
      callType: type,
      participant: caller,
      roomName,
      isMicMuted: false,
      isCameraOff: false,
    }),

  acceptCall: (serverUrl, roomToken) =>
    set({
      status: "connected",
      serverUrl,
      roomToken,
    }),

  endCall: () =>
    set({
      status: "idle",
      participant: null,
      serverUrl: undefined,
      roomToken: undefined,
      roomName: undefined,
      isMicMuted: false,
      isCameraOff: false,
    }),

  toggleMic: () => set((state) => ({ isMicMuted: !state.isMicMuted })),
  toggleCamera: () => set((state) => ({ isCameraOff: !state.isCameraOff })),
}));

