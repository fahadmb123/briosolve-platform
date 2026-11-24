import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GetCustomerDashboardInputDto } from "../../application/dtos/request/get-customer-dashboard.dto";
import { CustomerDashboardResponseDto } from "../../application/dtos/response/customer-dashboard-response.dto";
import { GetProviderDashboardInputDto } from "../../application/dtos/request/get-provider-dashboard.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";
import { GetAdminAuditLogsInputDto } from "../../application/use-cases/getAdminAuditLogs.useCase";
import { AdminAuditLogsResponseDto } from "../../domain/repositories/IDashboard.repository";

export class DashboardController extends BaseController {
    constructor(
        private readonly _getCustomerDashboardUseCase: IUseCase<GetCustomerDashboardInputDto, CustomerDashboardResponseDto>,
        private readonly _getProviderDashboardUseCase: IUseCase<GetProviderDashboardInputDto, ProviderDashboardResponseDto>,
        private readonly _getAdminDashboardUseCase: IUseCase<void, AdminDashboardResponseDto>,
        private readonly _getAdminAuditLogsUseCase: IUseCase<GetAdminAuditLogsInputDto, AdminAuditLogsResponseDto>
    ) {
        super();
    }

    getCustomerDashboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId as string;
            const response = await this._getCustomerDashboardUseCase.execute({ userId });

            return this.sendSuccess(res, "Customer dashboard retrieved successfully", response);
        } catch (err) {
            next(err);
        }
    };

    getProviderDashboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId as string;
            const response = await this._getProviderDashboardUseCase.execute({ userId });

            return this.sendSuccess(res, "Provider dashboard retrieved successfully", response);
        } catch (err) {
            next(err);
        }
    };

    getAdminDashboard = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const response = await this._getAdminDashboardUseCase.execute();

            return this.sendSuccess(res, "Admin dashboard retrieved successfully", response);
        } catch (err) {
            next(err);
        }
    };

    getAdminAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const type = req.query.type as string | undefined;
            const search = req.query.search as string | undefined;

            const response = await this._getAdminAuditLogsUseCase.execute({ page, limit, type, search });

            return this.sendSuccess(res, "Admin audit logs retrieved successfully", response);
        } catch (err) {
            next(err);
        }
    };
}
