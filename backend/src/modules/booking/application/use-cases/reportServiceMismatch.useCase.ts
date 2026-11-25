import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ReportServiceMismatchInputDto } from "../dtos/request/mismatch-report.dto";
import { BookingResponseDto, BookingStatusHistoryItem, MismatchReport } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class ReportServiceMismatchUseCase implements IUseCase<ReportServiceMismatchInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: ReportServiceMismatchInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const profile = await this._providerRepository.findById(details.booking.provider_id);
        if (!profile || profile.user_id !== input.providerUserId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to update this booking", "AUTHENTICATION");
        }

        const allowedStatuses = ["EN_ROUTE", "INSPECTION"];
        if (!allowedStatuses.includes(details.booking.status)) {
            throw new ApplicationError("INVALID_STATE", `Cannot report scope mismatch for booking with status ${details.booking.status}`, "VALIDATION");
        }

        if (!input.diagnosis || !input.diagnosis.trim()) {
            throw new ApplicationError("DIAGNOSIS_REQUIRED", "Please provide a detailed diagnosis of the issue found on site", "VALIDATION");
        }

        const qType = String(details.quotationType || "").toUpperCase();
        const isFixed = qType === "FIXED" || (!details.requiresInspection && qType !== "INSPECTION_REQUIRED" && qType !== "ESTIMATED");
        const advanceAmount = isFixed
            ? Number(details.booking.total_amount || 0)
            : (details.quoteAmount
                ? Math.round(Number(details.quoteAmount) * 1.05)
                : (details.booking.advance_amount && details.booking.advance_amount > 0
                    ? Number(details.booking.advance_amount)
                    : Number(details.booking.total_amount || 0)));

        const defaultVisitFee = Math.min(advanceAmount, 250);
        let visitFee = defaultVisitFee;
        if (typeof input.visitFee === "number" && !isNaN(input.visitFee) && input.visitFee >= 0) {
            visitFee = Math.min(advanceAmount, Math.round(input.visitFee));
        }
        const refundAmount = Math.max(0, advanceAmount - visitFee);

        const mismatchReport: MismatchReport = {
            status: "PENDING",
            diagnosis: input.diagnosis.trim(),
            suggestedCategory: input.suggestedCategory?.trim() || null,
            suggestedCategoryId: input.suggestedCategoryId || null,
            visitFee,
            refundAmount,
            reportedAt: new Date().toISOString()
        };

        let history: BookingStatusHistoryItem[] = [];
        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (typeof parsed === "object" && parsed !== null) {
                    if (Array.isArray(parsed.history)) {
                        history = parsed.history;
                    }
                }
            } catch {}
        }

        history.push({
            status: details.booking.status,
            note: `Technician reported service scope mismatch: "${input.diagnosis.trim()}"`,
            timestamp: new Date().toISOString(),
            authorName: profile.business_name || "Provider"
        });

        const serializedNotes = JSON.stringify({
            history,
            mismatchReport
        });

        await this._bookingRepository.update(details.booking.id, {
            notes: serializedNotes
        });

        if (this._createNotificationUseCase) {
            await this._createNotificationUseCase.execute({
                recipientId: details.booking.customer_id,
                type: "SERVICE_MISMATCH_REPORTED",
                title: "Technician Diagnosed a Different Issue",
                title_code: "SERVICE_MISMATCH_REPORTED",
                message: `Booking #${details.booking.booking_number}: Technician reported that your issue requires a different service. Please review the diagnosis.`
            }).catch(() => null);
        }

        const updatedDetails = await this._bookingRepository.findDetailsById(details.booking.id);
        return BookingMapper.toResponseDto(updatedDetails || details);
    }
}
