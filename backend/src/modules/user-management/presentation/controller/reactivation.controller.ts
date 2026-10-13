import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";
import { CreateAccountReactivationRequestUseCase } from "../../application/use-cases/createAccountReactivationRequest.useCase.js";
import { GetReactivationRequestsUseCase } from "../../application/use-cases/getReactivationRequests.useCase.js";

export class ReactivationController extends BaseController {
    constructor(
        private readonly createAccountReactivationRequestUseCase: CreateAccountReactivationRequestUseCase,
        private readonly getReactivationRequestsUseCase: GetReactivationRequestsUseCase
    ) {
        super();
    }

    requestReactivation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, reason } = req.body;
            const result = await this.createAccountReactivationRequestUseCase.execute({ email, reason });
            return sendSuccess(res, "", result);
        } catch (err) {
            next(err);
        }
    };

    getReactivations = async (req: Request, res: Response, next: NextFunction) => {
        try {
            this.getCurrentUser(req);

            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const search = req.query.search as string | undefined;
            const filter = req.query.filter as string | undefined;
            const role = req.query.role as string | undefined;
            const sort = (req.query.sort as "asc" | "desc") || "desc";

            const result = await this.getReactivationRequestsUseCase.execute({
                page,
                limit,
                search,
                filter,
                role,
                sort
            });

            return sendSuccess(res, "", {
                requests: result.requests,
                total: result.total,
                totalPages: result.totalPages
            });
        } catch (err) {
            next(err);
        }
    };
}
