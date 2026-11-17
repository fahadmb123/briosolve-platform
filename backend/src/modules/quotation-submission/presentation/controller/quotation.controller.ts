import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { SubmitQuotationInputDto } from "../../application/dtos/request/submit-quotation.dto";
import { QuotationResponseDto } from "../../application/dtos/response/quotation-response.dto";
import { GetProviderQuotationsInputDto } from "../../application/dtos/request/get-provider-quotations.dto";
import { ProviderQuotationsResponseDto } from "../../application/dtos/response/provider-quotations-response.dto";
import { UpdateQuotationInputDto } from "../../application/dtos/request/update-quotation.dto";
import { GetRequestQuotationsInputDto } from "../../application/dtos/request/get-request-quotations.dto";
import { RequestQuotationsResponseDto } from "../../application/dtos/response/request-quotations-response.dto";
import { AcceptQuotationInputDto } from "../../application/dtos/request/accept-quotation.dto";
import { RejectQuotationInputDto } from "../../application/dtos/request/reject-quotation.dto";

export class QuotationController extends BaseController {
    constructor(
        private readonly _submitQuotationUseCase: IUseCase<SubmitQuotationInputDto, QuotationResponseDto>,
        private readonly _getProviderQuotationsUseCase: IUseCase<GetProviderQuotationsInputDto, ProviderQuotationsResponseDto>,
        private readonly _updateQuotationUseCase: IUseCase<UpdateQuotationInputDto, QuotationResponseDto>,
        private readonly _getRequestQuotationsUseCase: IUseCase<GetRequestQuotationsInputDto, RequestQuotationsResponseDto>,
        private readonly _acceptQuotationUseCase: IUseCase<AcceptQuotationInputDto, { id: string; status: string; serviceRequestId: string }>,
        private readonly _rejectQuotationUseCase: IUseCase<RejectQuotationInputDto, { id: string; status: string }>
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

    updateQuotation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerUserId = req.user?.userId;
            const quotationId = String(req.params.id);

            const response = await this._updateQuotationUseCase.execute({
                ...req.body,
                quotationId,
                providerUserId: providerUserId!
            });

            return this.sendSuccess(res, "Updated", response, 200);
        } catch (error) {
            next(error);
        }
    };

    getRequestQuotations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role || "CUSTOMER";
            const serviceRequestId = String(req.params.serviceRequestId);

            const response = await this._getRequestQuotationsUseCase.execute({
                serviceRequestId,
                userId: userId!,
                userRole
            });

            return this.sendSuccess(res, "Fetched quotations", response, 200);
        } catch (error) {
            next(error);
        }
    };

    acceptQuotation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerUserId = req.user?.userId;
            const quotationId = String(req.params.id);

            const response = await this._acceptQuotationUseCase.execute({
                quotationId,
                customerUserId: customerUserId!
            });

            return this.sendSuccess(res, "Quotation accepted", response, 200);
        } catch (error) {
            next(error);
        }
    };

    rejectQuotation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerUserId = req.user?.userId;
            const quotationId = String(req.params.id);
            const reason = req.body?.reason;

            const response = await this._rejectQuotationUseCase.execute({
                quotationId,
                customerUserId: customerUserId!,
                reason
            });

            return this.sendSuccess(res, "Quotation declined", response, 200);
        } catch (error) {
            next(error);
        }
    };
}
