export interface GenerateTokenParams {
    roomName: string;
    participantIdentity: string;
    participantName?: string;
}

export interface ILiveKitService {
    generateToken(params: GenerateTokenParams): Promise<{ token: string; serverUrl: string }>;
}

