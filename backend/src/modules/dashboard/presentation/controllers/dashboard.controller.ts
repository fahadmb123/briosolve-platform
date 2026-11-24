import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GetCustomerDashboardRequestDto } from "../../application/dtos/request/get-customer-dashboard.dto";
import { CustomerDashboardResponseDto } from "../../application/dtos/response/customer-dashboard-response.dto";
import { GetProviderDashboardRequestDto } from "../../application/dtos/request/get-provider-dashboard.dto";
import { ProviderDashboardResponseDto } from "../../application/dtos/response/provider-dashboard-response.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/response/admin-dashboard-response.dto";
import { GetAdminAuditLogsRequestDto } from "../../application/dtos/request/get-admin-audit-logs.dto";
import { AdminAuditLogsResponseDto } from "../../application/dtos/response/admin-audit-logs-response.dto";

export class DashboardController extends BaseController {
    constructor(
        private readonly _getCustomerDashboardUseCase: IUseCase<GetCustomerDashboardRequestDto, CustomerDashboardResponseDto>,
        private readonly _getProviderDashboardUseCase: IUseCase<GetProviderDashboardRequestDto, ProviderDashboardResponseDto>,
        private readonly _getAdminDashboardUseCase: IUseCase<void, AdminDashboardResponseDto>,
        private readonly _getAdminAuditLogsUseCase: IUseCase<GetAdminAuditLogsRequestDto, AdminAuditLogsResponseDto>
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
