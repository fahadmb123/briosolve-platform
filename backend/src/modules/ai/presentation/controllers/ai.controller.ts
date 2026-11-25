import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CompareQuotationsRequestDto } from "../../application/dtos/request/compare-quotations.request.dto";
import { CompareQuotationsResponseDto } from "../../application/dtos/response/compare-quotations.response.dto";

export class AiController extends BaseController {
    constructor(
        private readonly _compareQuotationsUseCase: IUseCase<CompareQuotationsRequestDto, CompareQuotationsResponseDto>
    ) {
        super()
    }

    compareQuotations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            const { serviceRequestId, topN } = req.body;

            const response = await this._compareQuotationsUseCase.execute({
                userId: customerId!,
                serviceRequestId,
                topN: topN !== undefined ? Number(topN) : undefined,
            });

            return this.sendSuccess(res, "Quotations evaluated and compared successfully", response);
        } catch (error) {
            next(error);
        }
    };
}
