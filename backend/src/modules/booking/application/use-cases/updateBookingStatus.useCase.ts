import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { UpdateBookingStatusInputDto } from "../dtos/request/update-booking-status.dto";
import { BookingResponseDto, BookingStatusHistoryItem } from "../dtos/response/booking-response.dto";
import { BookingMapper, BookingStatusToTitle } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class UpdateBookingStatusUseCase implements IUseCase<UpdateBookingStatusInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: UpdateBookingStatusInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const providerProfile = await this._providerRepository.findProfileByUserId(input.userId);

        const isAuthorized =
            details.booking.customer_id === input.userId ||
            (providerProfile && providerProfile.id === details.booking.provider_id);

        if (!isAuthorized) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to update this booking", "AUTHENTICATION");
        }

        let history: BookingStatusHistoryItem[] = [];
        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (typeof parsed === "object" && parsed !== null) {
                    history = [parsed];
                } else if (typeof details.booking.notes === "string" && details.booking.notes.trim()) {
                    history = [{
                        status: details.booking.status,
                        note: details.booking.notes,
                        timestamp: details.booking.updated_at.toISOString(),
                        authorName: providerProfile?.business_name || null
                    }];
                }
            } catch {
                if (details.booking.notes.trim()) {
                    history = [{
                        status: details.booking.status,
                        note: details.booking.notes,
                        timestamp: details.booking.updated_at.toISOString(),
                        authorName: providerProfile?.business_name || null
                    }];
                }
            }
        }

        if (input.notes && input.notes.trim()) {
            history.push({
                status: input.status,
                note: input.notes.trim(),
                timestamp: new Date().toISOString(),
                authorName: providerProfile?.business_name || null
            });
        }

        const serializedNotes = history.length > 0 ? JSON.stringify(history) : details.booking.notes;

        const nextPaymentStatus = input.paymentStatus || (input.status === "COMPLETED" ? "PAID" : details.booking.payment_status);

        const isFixedQuote = details.quotationType === "FIXED";
        let resolvedTotalAmount: number | undefined = undefined;
        if (input.totalAmount !== undefined && Number(input.totalAmount) > 0) {
            if (!isFixedQuote) {
                resolvedTotalAmount = Math.max(Number(input.totalAmount), Number(details.booking.advance_amount || 0));
            }
        }

        const updated = await this._bookingRepository.update(details.booking.id, {
            status: input.status,
            notes: serializedNotes,
            paymentStatus: nextPaymentStatus,
            totalAmount: resolvedTotalAmount
        });

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update booking status", "INTERNAL");
        }

        const updatedDetails = await this._bookingRepository.findDetailsById(updated.id);

        if (this._createNotificationUseCase) {
            const isCustomerAction = details.booking.customer_id === input.userId;
            let targetRecipientId: string | null = null;

            if (isCustomerAction) {
                const profile = await this._providerRepository.findById(details.booking.provider_id);
                targetRecipientId = profile ? profile.user_id : null;
            } else {
                targetRecipientId = details.booking.customer_id;
            }

            if (targetRecipientId) {
                const message = input.status === "PAYMENT_PENDING"
                    ? `Booking #${details.booking.booking_number} total confirmed at ₹${(resolvedTotalAmount || details.booking.total_amount).toLocaleString("en-IN")}. Please review and settle the remaining balance.`
                    : `Booking #${details.booking.booking_number} for "${details.serviceRequestTitle || "Service"}" has been marked as ${input.status}.`;

                await this._createNotificationUseCase.execute({
                    recipientId: targetRecipientId,
                    type: "BOOKING_STATUS_UPDATED",
                    title: `Booking ${BookingStatusToTitle[input.status]}`,
                    title_code: "BOOKING_STATUS_UPDATED",
                    message
                }).catch(() => null);
            }
        }

        return BookingMapper.toResponseDto(updatedDetails || updated);
    }
}
