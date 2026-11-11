export interface GenerateCallTokenRequestDto {
    roomName: string;
    participantIdentity: string;
    participantName?: string;
    callType?: "audio" | "video";
}

