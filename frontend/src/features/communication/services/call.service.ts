import { apiClient } from "../../../shared/api/Client";
import { sendMessage } from "../../chat/services/chat.service";

export interface GenerateCallTokenResponse {
  token: string;
  serverUrl: string;
  roomName: string;
  participantIdentity: string;
}

export async function fetchCallToken(
  roomName: string,
  callType: "audio" | "video" = "audio",
  participantName?: string
): Promise<GenerateCallTokenResponse> {
  const response = await apiClient.post<{ data: GenerateCallTokenResponse }>(
    "/api/communication/call/token",
    {
      roomName,
      callType,
      participantName
    }
  );
  return response.data.data;
}

export async function recordCallMessage(
  conversationId: string,
  callType: "audio" | "video",
  outcome: "completed" | "missed" | "declined",
  durationSeconds?: number
): Promise<void> {
  try {
    const icon = callType === "video" ? "📹" : "📞";
    const typeLabel = callType === "video" ? "Video call" : "Audio call";
    let content = "";

    if (outcome === "completed" && durationSeconds && durationSeconds > 0) {
      const mins = Math.floor(durationSeconds / 60);
      const secs = durationSeconds % 60;
      const durStr = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
      content = `${icon} ${typeLabel} ended • ${durStr}`;
    } else if (outcome === "declined") {
      content = `${icon} Declined ${callType} call`;
    } else {
      content = `${icon} Missed ${callType} call`;
    }

    await sendMessage(conversationId, {
      content,
      messageType: "TEXT"
    });
  } catch {
    return;
  }
}
