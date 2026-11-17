import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { SubmitQuotationInputDto } from "../../application/dtos/request/submit-quotation.dto";
import { QuotationResponseDto } from "../../application/dtos/response/quotation-response.dto";
import { GetProviderQuotationsInputDto } from "../../application/dtos/request/get-provider-quotations.dto";
import { ProviderQuotationsResponseDto } from "../../application/dtos/response/provider-quotations-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class QuotationController extends BaseController {
    constructor(
        private readonly _submitQuotationUseCase: IUseCase<SubmitQuotationInputDto, QuotationResponseDto>,
        private readonly _getProviderQuotationsUseCase: IUseCase<GetProviderQuotationsInputDto, ProviderQuotationsResponseDto>
    ) {
        super();
    }

    submitQuotation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerUserId = req.user?.userId;

            const response = await this._submitQuotationUseCase.execute({
                ...req.body,
                providerUserId
            });

            return this.sendSuccess(res, "Submitted", response, 201);
        } catch (error) {
            next(error);
        }
    };

    getMyQuotations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerUserId = req.user?.userId;

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const status = (req.query.status as string) || "ALL";
            const sortBy = (req.query.sortBy as "NEWEST" | "OLDEST") || "NEWEST";

            const response = await this._getProviderQuotationsUseCase.execute({
                providerUserId: providerUserId!,
                page,
                limit,
                status,
                sortBy
            });

            return this.sendSuccess(res, "Fetched", response, 200);
        } catch (error) {
            next(error);
        }
    };
}
