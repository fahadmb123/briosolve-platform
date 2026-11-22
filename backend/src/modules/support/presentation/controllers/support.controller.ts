import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateTicketInputDto } from "../../application/dtos/request/create-ticket.dto";
import { TicketResponseDto } from "../../application/dtos/response/ticket-response.dto";
import { GetMyTicketsInputDto } from "../../application/use-cases/getMyTickets.useCase";

export class SupportController extends BaseController {
  constructor(
    private readonly _createTicketUseCase: IUseCase<CreateTicketInputDto, TicketResponseDto>,
    private readonly _getMyTicketsUseCase: IUseCase<GetMyTicketsInputDto, TicketResponseDto[]>
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
      const response = await this._getMyTicketsUseCase.execute({ userId: userId! });
      return this.sendSuccess(res, "Tickets retrieved successfully", response, 200);
    } catch (error) {
      next(error);
    }
  };
}
