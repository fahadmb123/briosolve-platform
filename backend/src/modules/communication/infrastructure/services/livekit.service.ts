import { AccessToken } from "livekit-server-sdk";
import { ILiveKitService, GenerateTokenParams } from "../../domain/services/ILiveKitService";
import { envConfig } from "../../../../shared/config/env.config";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class LiveKitService implements ILiveKitService {
    async generateToken(params: GenerateTokenParams): Promise<{ token: string; serverUrl: string }> {
        const apiKey = envConfig.LIVEKIT_API_KEY;
        const apiSecret = envConfig.LIVEKIT_API_SECRET;
        const serverUrl = envConfig.LIVEKIT_URL;

        if (!apiKey || !apiSecret || !serverUrl) {
            throw new ApplicationError("SERVER_ERROR", "LiveKit configuration is missing", "INTERNAL");
        }

        const at = new AccessToken(apiKey, apiSecret, {
            identity: params.participantIdentity,
            name: params.participantName || params.participantIdentity
        });

        at.addGrant({
            roomJoin: true,
            room: params.roomName,
            canPublish: true,
            canSubscribe: true
        });

        const token = await at.toJwt();

        return {
            token,
            serverUrl
        };
    }
}

