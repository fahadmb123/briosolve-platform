import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GenerateCallTokenRequestDto } from "../dtos/request/generate-call-token.dto";
import { CallTokenResponseDto } from "../dtos/response/call-token-response.dto";
import { ILiveKitService } from "../../domain/services/ILiveKitService";

export class GenerateCallTokenUseCase implements IUseCase<GenerateCallTokenRequestDto, CallTokenResponseDto> {
    constructor(
        private readonly _liveKitService: ILiveKitService
    ) {}

    async execute(input: GenerateCallTokenRequestDto): Promise<CallTokenResponseDto> {
        const { token, serverUrl } = await this._liveKitService.generateToken({
            roomName: input.roomName,
            participantIdentity: input.participantIdentity,
            participantName: input.participantName
        });

        return {
            token,
            serverUrl,
            roomName: input.roomName,
            participantIdentity: input.participantIdentity
        };
    }
}

