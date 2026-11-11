import { apiClient } from "../../../shared/api/Client";

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

