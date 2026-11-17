import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { SubmitQuotationInputDto } from "../../application/dtos/request/submit-quotation.dto";
import { QuotationResponseDto } from "../../application/dtos/response/quotation-response.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class QuotationController extends BaseController {
    constructor(
        private readonly _submitQuotationUseCase: IUseCase<SubmitQuotationInputDto, QuotationResponseDto>
    ) {
        super();
    }

    submitQuotation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerUserId = req.user?.userId;
            if (!providerUserId) {
                throw new ApplicationError("UNAUTHORIZED", "Provider authentication is required", "AUTHENTICATION");
            }

            const response = await this._submitQuotationUseCase.execute({
                ...req.body,
                providerUserId
            });

            return this.sendSuccess(res, "Quotation submitted successfully", response, 201);
        } catch (error) {
            next(error);
        }
    };
}
