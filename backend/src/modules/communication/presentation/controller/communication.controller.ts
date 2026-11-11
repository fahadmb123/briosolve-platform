import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GenerateCallTokenRequestDto } from "../../application/dtos/request/generate-call-token.dto";
import { CallTokenResponseDto } from "../../application/dtos/response/call-token-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class CommunicationController extends BaseController {
    constructor(
        private readonly _generateCallTokenUseCase: IUseCase<GenerateCallTokenRequestDto, CallTokenResponseDto>
    ) {
        super();
    }

    generateCallToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new ApplicationError("UNAUTHORIZED", "User ID is required", "AUTHENTICATION");
            }

            const response = await this._generateCallTokenUseCase.execute({
                roomName: req.body.roomName,
                participantIdentity: userId,
                participantName: req.body.participantName || userId,
                callType: req.body.callType
            });

            this.sendSuccess(res, "Call token generated successfully", response);
        } catch (error) {
            next(error);
        }
    };
}
