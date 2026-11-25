import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IQuotationRepository } from "../../../quotation-submission/domain/repositories/IQuotationRepository";
import { AdminUpdateBookingStatusInputDto } from "../dtos/request/update-booking-status.dto";
import { BookingResponseDto, BookingStatusHistoryItem } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";

export class AdminUpdateBookingStatusUseCase implements IUseCase<AdminUpdateBookingStatusInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestRepository?: IServiceRequestRepository,
        private readonly _quotationRepository?: IQuotationRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
        private readonly _creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
    ) {}

    async execute(input: AdminUpdateBookingStatusInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const currentStatus = details.booking.status;

        if (currentStatus === "CANCELLED" || currentStatus === "CLOSED") {
            throw new ApplicationError(
                "TERMINAL_STATE",
                `Booking #${details.booking.booking_number} is ${currentStatus} and cannot be modified.`,
                "VALIDATION"
            );
        }

        if (currentStatus === "COMPLETED") {
            if (input.status === "CLOSED") {
            } else {
                throw new ApplicationError(
                    "BOOKING_ALREADY_COMPLETED",
                    `Booking #${details.booking.booking_number} is already completed. Completed bookings cannot be cancelled or reverted to protect wallet and escrow transactions.`,
                    "VALIDATION"
                );
            }
        }

        if (input.status === "COMPLETED" && currentStatus !== "IN_PROGRESS" && currentStatus !== "PAYMENT_PENDING") {
            throw new ApplicationError(
                "INVALID_STATUS_TRANSITION",
                `Cannot release escrow or complete booking from ${currentStatus}. Work must be in progress or payment pending.`,
                "VALIDATION"
            );
        }

        let history: BookingStatusHistoryItem[] = [];
        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.history)) {
                    history = parsed.history;
                }
            } catch {
                history = [{
                    status: details.booking.status,
                    note: details.booking.notes,
                    timestamp: details.booking.updated_at.toISOString(),
                    authorName: "System"
                }];
            }
        }

        const noteText = input.reason?.trim() || `Status updated to ${input.status} by Administrator`;
        history.push({
            status: input.status,
            note: `[Admin Action] ${noteText}`,
            timestamp: new Date().toISOString(),
            authorName: "Platform Administrator"
        });

        let updatedPaymentStatus = details.booking.payment_status;

        if (input.status === "CANCELLED") {
            updatedPaymentStatus = "REFUNDED";
            if (this._serviceRequestRepository) {
                await this._serviceRequestRepository.updateStatus(details.booking.service_request_id, "EXPIRED").catch(() => null);
            }
            if (this._quotationRepository) {
                await this._quotationRepository.update(details.booking.quotation_id, {
                    status: "WITHDRAWN",
                    rejectionReason: `Booking cancelled by Administrator: ${noteText}`
                }).catch(() => null);
            }
            if (this._creditWalletUseCase && details.booking.payment_status !== "REFUNDED") {
                const refundAmount = details.booking.advance_amount && details.booking.advance_amount > 0
                    ? Number(details.booking.advance_amount)
                    : Number(details.booking.total_amount);
                if (refundAmount > 0) {
                    await this._creditWalletUseCase.execute({
                        userId: details.booking.customer_id,
                        amount: refundAmount,
                        category: "REFUND",
                        bookingId: details.booking.id,
                        description: `Admin refund for cancelled booking #${details.booking.booking_number}`,
                        referenceId: details.booking.booking_number
                    }).catch(() => null);
                }
            }
        } else if (input.status === "COMPLETED") {
            updatedPaymentStatus = "PAID";
            if (this._serviceRequestRepository) {
                await this._serviceRequestRepository.updateStatus(details.booking.service_request_id, "COMPLETED").catch(() => null);
            }
            await this._providerRepository.incrementCompletedJobs(details.booking.provider_id).catch(() => null);

            if (this._creditWalletUseCase && details.booking.payment_status !== "PAID") {
                const profile = await this._providerRepository.findById(details.booking.provider_id);
                if (profile && profile.user_id) {
                    const finalTotal = details.booking.total_amount;
                    const customerPlatformFee = Number(details.booking.platform_fee || 0);
                    const baseAmount = customerPlatformFee > 0
                        ? Math.max(0, finalTotal - customerPlatformFee)
                        : Math.round(finalTotal / 1.05);
                    const providerCommission = Math.round(baseAmount * 0.05);
                    const earnings = Math.max(0, baseAmount - providerCommission);
                    if (earnings > 0) {
                        await this._creditWalletUseCase.execute({
                            userId: profile.user_id,
                            amount: earnings,
                            category: "EARNINGS",
                            bookingId: details.booking.id,
                            description: `Admin payout for completed booking #${details.booking.booking_number}`,
                            referenceId: details.booking.booking_number
                        }).catch(() => null);
                    }
                }
            }
        }

        const updated = await this._bookingRepository.update(details.booking.id, {
            status: input.status,
            notes: JSON.stringify(history),
            paymentStatus: updatedPaymentStatus
        });

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update booking status", "INTERNAL");
        }

        if (this._createNotificationUseCase) {
            const profile = await this._providerRepository.findById(details.booking.provider_id);
            const providerUserId = profile ? profile.user_id : null;

            const notifyPayload = (recipientId: string) => ({
                recipientId,
                type: "BOOKING_STATUS_UPDATED",
                title: `Booking #${details.booking.booking_number} Updated by Admin`,
                title_code: "BOOKING_STATUS_UPDATED",
                message: `Booking #${details.booking.booking_number} has been set to ${input.status} by platform administration. Note: ${noteText}`
            });

            await this._createNotificationUseCase.execute(notifyPayload(details.booking.customer_id)).catch(() => null);
            if (providerUserId) {
                await this._createNotificationUseCase.execute(notifyPayload(providerUserId)).catch(() => null);
            }
        }

        const reloaded = await this._bookingRepository.findDetailsById(updated.id);
        return BookingMapper.toResponseDto(reloaded || updated);
    }
}
