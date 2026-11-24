import { Request, Response, NextFunction } from "express";
import { BaseController } from "../../../../shared/base/controller/baseController";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import {
  GetCustomerDashboardInputDto,
  CustomerDashboardResponseDto,
} from "../../application/dtos/customer-dashboard.dto";
import {
  GetProviderDashboardInputDto,
  ProviderDashboardResponseDto,
} from "../../application/dtos/provider-dashboard.dto";
import { AdminDashboardResponseDto } from "../../application/dtos/admin-dashboard.dto";
import { ApplicationError } from "../../../../shared/errors/applicationError";

export class DashboardController extends BaseController {
  constructor(
    private readonly _getCustomerDashboardUseCase: IUseCase<
      GetCustomerDashboardInputDto,
      CustomerDashboardResponseDto
    >,
    private readonly _getProviderDashboardUseCase: IUseCase<
      GetProviderDashboardInputDto,
      ProviderDashboardResponseDto
    >,
    private readonly _getAdminDashboardUseCase: IUseCase<
      void,
      AdminDashboardResponseDto
    >
  ) {
    super();
  }

  getCustomerDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ApplicationError(
          "AUTHENTICATION_REQUIRED",
          "Authentication required",
          "AUTHENTICATION"
        );
      }

      const result = await this._getCustomerDashboardUseCase.execute({ userId });
      this.sendSuccess(res, "Customer dashboard retrieved successfully", result, 200);
    } catch (error) {
      next(error);
    }
  };

  getProviderDashboard = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new ApplicationError(
          "AUTHENTICATION_REQUIRED",
          "Authentication required",
          "AUTHENTICATION"
        );
      }

      const result = await this._getProviderDashboardUseCase.execute({ userId });
      this.sendSuccess(res, "Provider dashboard retrieved successfully", result, 200);
    } catch (error) {
      next(error);
    }
  };

  getAdminDashboard = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this._getAdminDashboardUseCase.execute();
      this.sendSuccess(res, "Admin dashboard retrieved successfully", result, 200);
    } catch (error) {
      next(error);
    }
  };
}
