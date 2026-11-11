export type CallType = "audio" | "video";

export type CallStatus = "idle" | "calling" | "ringing" | "connected" | "ended";

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export interface IncomingCallModalProps {
  isOpen: boolean;
  caller: CallParticipant;
  callType: CallType;
  onAccept: () => void;
  onDecline: () => void;
}

export interface OutgoingCallModalProps {
  isOpen: boolean;
  recipient: CallParticipant;
  callType: CallType;
  onCancel: () => void;
}

export interface ActiveCallModalProps {
  isOpen: boolean;
  serverUrl?: string;
  roomToken?: string;
  callType: CallType;
  remoteParticipant: CallParticipant;
  onEndCall: () => void;
  isMicMuted?: boolean;
  isCameraOff?: boolean;
  onToggleMic?: () => void;
  onToggleCamera?: () => void;
}

export interface CallActionButtonsProps {
  onStartAudioCall?: () => void;
  onStartVideoCall?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface CallStatusBadgeProps {
  participantName: string;
  callType: CallType;
  duration?: string;
  onExpand?: () => void;
  onEndCall?: () => void;
  className?: string;
}

