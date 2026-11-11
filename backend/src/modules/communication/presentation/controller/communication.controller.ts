import type { Request, Response, NextFunction } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { SendCommunicationRequestDto } from "../../application/dtos/request/send-communication.dto";
import { GetCommunicationsRequestDto } from "../../application/dtos/request/get-communications.dto";
import { GenerateCallTokenRequestDto } from "../../application/dtos/request/generate-call-token.dto";
import { CommunicationResponseDto, PaginatedCommunicationResponseDto } from "../../application/dtos/response/communication-response.dto";
import { CallTokenResponseDto } from "../../application/dtos/response/call-token-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class CommunicationController extends BaseController {
    constructor(
        private readonly _sendCommunicationUseCase: IUseCase<SendCommunicationRequestDto, CommunicationResponseDto>,
        private readonly _getCommunicationsUseCase: IUseCase<GetCommunicationsRequestDto, PaginatedCommunicationResponseDto>,
        private readonly _generateCallTokenUseCase: IUseCase<GenerateCallTokenRequestDto, CallTokenResponseDto>
    ) {
        super();
    }

    sendCommunication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const senderId = req.user?.userId ?? null;
            const response = await this._sendCommunicationUseCase.execute({
                ...req.body,
                senderId
            });

            this.sendSuccess(res, "Communication sent successfully", response, 201);
        } catch (error) {
            next(error);
        }
    };

    getCommunications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new ApplicationError("UNAUTHORIZED", "User ID is required", "AUTHENTICATION");
            }

            const response = await this._getCommunicationsUseCase.execute({
                recipientId: userId,
                channel: req.query.channel as GetCommunicationsRequestDto["channel"],
                status: req.query.status as GetCommunicationsRequestDto["status"],
                page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10
            });

            this.sendSuccess(res, "Communications retrieved successfully", response);
        } catch (error) {
            next(error);
        }
    };

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

