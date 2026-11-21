import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { GetBookingByIdInputDto, GetCustomerBookingsInputDto, GetProviderBookingsInputDto } from "../../application/dtos/request/get-booking.dto";
import { UpdateBookingStatusInputDto } from "../../application/dtos/request/update-booking-status.dto";
import { ReportServiceMismatchInputDto, ResolveServiceMismatchInputDto } from "../../application/dtos/request/mismatch-report.dto";
import { BookingResponseDto } from "../../application/dtos/response/booking-response.dto";
import { CustomerBookingsResponseDto } from "../../application/dtos/response/customer-bookings-response.dto";
import { ProviderBookingsResponseDto } from "../../application/dtos/response/provider-bookings-response.dto";

export class BookingController extends BaseController {
    constructor(
        private readonly _getBookingByIdUseCase: IUseCase<GetBookingByIdInputDto, BookingResponseDto>,
        private readonly _getCustomerBookingsUseCase: IUseCase<GetCustomerBookingsInputDto, CustomerBookingsResponseDto>,
        private readonly _getProviderBookingsUseCase: IUseCase<GetProviderBookingsInputDto, ProviderBookingsResponseDto>,
        private readonly _updateBookingStatusUseCase: IUseCase<UpdateBookingStatusInputDto, BookingResponseDto>,
        private readonly _reportServiceMismatchUseCase: IUseCase<ReportServiceMismatchInputDto, BookingResponseDto>,
        private readonly _resolveServiceMismatchUseCase: IUseCase<ResolveServiceMismatchInputDto, BookingResponseDto>
    ) {
        super();
    }

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const bookingId = req.params.id as string;

            const response = await this._getBookingByIdUseCase.execute({
                bookingId,
                userId: userId!
            });

            return this.sendSuccess(res, "Booking retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    getCustomerBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;

            const response = await this._getCustomerBookingsUseCase.execute({
                customerId: customerId!,
                page,
                limit,
                search,
                status
            });

            return this.sendSuccess(res, "Customer bookings retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    getProviderBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerId = req.user?.userId;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 50;
            const search = req.query.search as string | undefined;
            const status = req.query.status as string | undefined;

            const response = await this._getProviderBookingsUseCase.execute({
                providerId: providerId!,
                page,
                limit,
                search,
                status
            });

            return this.sendSuccess(res, "Provider bookings retrieved successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.userId;
            const bookingId = req.params.id as string;
            const { status, notes, totalAmount } = req.body;

            const response = await this._updateBookingStatusUseCase.execute({
                bookingId,
                userId: userId!,
                status,
                notes,
                totalAmount: totalAmount !== undefined ? Number(totalAmount) : undefined
            });

            return this.sendSuccess(res, "Booking status updated successfully", response, 200);
        } catch (error) {
            next(error);
        }
    };

    reportMismatch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const providerUserId = req.user?.userId;
            const bookingId = req.params.id as string;
            const { diagnosis, suggestedCategory, suggestedCategoryId, visitFee } = req.body;

            const response = await this._reportServiceMismatchUseCase.execute({
                bookingId,
                providerUserId: providerUserId!,
                diagnosis,
                visitFee: typeof visitFee === "number" ? visitFee : (visitFee ? Number(visitFee) : undefined),
                suggestedCategory,
                suggestedCategoryId
            });

            return this.sendSuccess(res, "Scope mismatch report submitted to customer", response, 200);
        } catch (error) {
            next(error);
        }
    };

    resolveMismatch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            const bookingId = req.params.id as string;
            const { action } = req.body;

            const response = await this._resolveServiceMismatchUseCase.execute({
                bookingId,
                customerId: customerId!,
                action
            });

            return this.sendSuccess(res, action === "ACCEPT" ? "Diagnosis accepted and booking closed" : "Diagnosis report declined", response, 200);
        } catch (error) {
            next(error);
        }
    };
}
