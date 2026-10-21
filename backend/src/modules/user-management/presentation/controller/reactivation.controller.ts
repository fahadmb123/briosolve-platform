import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import { registrationCookie } from "../../../../shared/presentation/http/cookies/cookieConfig";
import { CreateAccountReactivationRequestUseCase } from "../../application/use-cases/reactivation/createAccountReactivationRequest.useCase";
import { GetReactivationRequestsUseCase } from "../../application/use-cases/reactivation/getReactivationRequests.useCase";
import { SendReactivationOtpUseCase } from "../../application/use-cases/reactivation/sendReactivationOtp.useCase";

export class ReactivationController extends BaseController {
    constructor(
        private readonly createAccountReactivationRequestUseCase: CreateAccountReactivationRequestUseCase,
        private readonly getReactivationRequestsUseCase: GetReactivationRequestsUseCase,
        private readonly sendReactivationOtpUseCase: SendReactivationOtpUseCase
    ) {
        super();
    }

    sendOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            const response = await this.sendReactivationOtpUseCase.execute({ email });
            res.cookie("registration_id", response.registrationId, registrationCookie);
            return this.sendSuccess(res, "OTP sent successfully", { expiresIn: response.expiresIn });
        } catch (err) {
            next(err);
        }
    };

    requestReactivation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, reason } = req.body;
            const registrationId = req.cookies.registration_id;
            const result = await this.createAccountReactivationRequestUseCase.execute({
                email,
                reason,
                registrationId
            });
            if (registrationId) {
                res.clearCookie("registration_id");
            }
            return this.sendSuccess(res, "", result);
        } catch (err) {
            next(err);
        }
    };

    getReactivations = async (req: Request, res: Response, next: NextFunction) => {
        try {
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

            return this.sendSuccess(res, "", {
                requests: result.requests,
                total: result.total,
                totalPages: result.totalPages
            });
        } catch (err) {
            next(err);
        }
    };
}
