import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { WalletResponseDto } from "../../application/dtos/response/wallet-response.dto";
import { GetWalletDetailsInputDto } from "../../application/dtos/response/get-wallet-details.dto";

export class WalletController extends BaseController {
    constructor(
        private readonly _getWalletDetailsUseCase: IUseCase<GetWalletDetailsInputDto, WalletResponseDto>
    ) {
        super();
    }

    getMyWallet = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const limit = req.query.limit ? Number(req.query.limit) : 20;
            const offset = req.query.offset ? Number(req.query.offset) : 0;

            const response = await this._getWalletDetailsUseCase.execute({
                userId: userId!,
                limit,
                offset
            });

            return this.sendSuccess(res, "Wallet retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };
}
