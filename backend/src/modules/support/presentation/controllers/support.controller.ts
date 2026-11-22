import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateTicketInputDto } from "../../application/dtos/request/create-ticket.dto";
import { TicketResponseDto } from "../../application/dtos/response/ticket-response.dto";
import { GetMyTicketsInputDto, UserTicketsResponseDto } from "../../application/use-cases/getMyTickets.useCase";
import { GetAdminTicketsInputDto, AdminTicketsResponseDto } from "../../application/use-cases/getAdminTickets.useCase";

export class SupportController extends BaseController {
  constructor(
    private readonly _createTicketUseCase: IUseCase<CreateTicketInputDto, TicketResponseDto>,
    private readonly _getMyTicketsUseCase: IUseCase<GetMyTicketsInputDto, UserTicketsResponseDto>,
    private readonly _getAdminTicketsUseCase: IUseCase<GetAdminTicketsInputDto, AdminTicketsResponseDto>
  ) {
    super();
  }

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const role = (req.user?.role || "CUSTOMER") as "CUSTOMER" | "PROVIDER";
      const {
        targetType,
        targetId,
        targetNumber,
        bookingId,
        bookingNumber,
        serviceTitle,
        category,
        categoryLabel,
        subject,
        description,
        metadata,
        priority,
        authorName
      } = req.body;

      const resolvedTargetType = targetType || (bookingId || bookingNumber ? "BOOKING" : "GENERAL");
      const resolvedTargetId = targetId || bookingId || null;
      const resolvedTargetNumber = targetNumber || bookingNumber || null;
      const resolvedMetadata = {
        ...(metadata || {}),
        ...(serviceTitle ? { serviceTitle } : {})
      };

      const response = await this._createTicketUseCase.execute({
        creatorId: userId!,
        creatorRole: role,
        targetType: resolvedTargetType,
        targetId: resolvedTargetId,
        targetNumber: resolvedTargetNumber,
        category: category || "GENERAL_INQUIRY",
        categoryLabel: categoryLabel || "General Inquiry",
        subject,
        description,
        metadata: resolvedMetadata,
        priority,
        authorName: authorName || (role === "PROVIDER" ? "Provider" : "Customer")
      });

      return this.sendSuccess(res, "Ticket created successfully", response, 201);
    } catch (error) {
      next(error);
    }
  };

  getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const response = await this._getMyTicketsUseCase.execute({
        userId: userId!,
        status,
        search,
        page,
        limit
      });

      return this.sendSuccess(res, "Tickets retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };

  getAdminTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const category = req.query.category as string | undefined;
      const priority = req.query.priority as string | undefined;
      const search = req.query.search as string | undefined;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;

      const response = await this._getAdminTicketsUseCase.execute({
        status,
        category,
        priority,
        search,
        page,
        limit
      });

      return this.sendSuccess(res, "Admin tickets retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };
}
