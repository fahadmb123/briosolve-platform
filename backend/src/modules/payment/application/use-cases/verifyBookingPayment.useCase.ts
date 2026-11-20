import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../../booking/domain/repositories/IBookingRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IRazorpayService } from "../../domain/services/IRazorpayService";
import { VerifyBookingPaymentInputDto } from "../dtos/request/verify-booking-payment.dto";
import { VerifyBookingPaymentResponseDto } from "../dtos/response/verify-booking-payment-response.dto";
import { BookingStatusHistoryItem } from "../../../booking/application/dtos/response/booking-response.dto";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class VerifyBookingPaymentUseCase implements IUseCase<VerifyBookingPaymentInputDto, VerifyBookingPaymentResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _razorpayService: IRazorpayService,
        private readonly _creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: VerifyBookingPaymentInputDto): Promise<VerifyBookingPaymentResponseDto> {
        const isValid = this._razorpayService.verifySignature(
            input.razorpayOrderId,
            input.razorpayPaymentId,
            input.razorpaySignature
        );

        if (!isValid) {
            throw new ApplicationError("INVALID_SIGNATURE", "Payment verification failed. Invalid signature", "VALIDATION");
        }

        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        if (details.booking.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized for this payment", "AUTHENTICATION");
        }

        if (details.booking.status !== "PAYMENT_PENDING") {
            throw new ApplicationError("INVALID_STATE", `Booking is not awaiting payment (current: ${details.booking.status})`, "VALIDATION");
        }

        let history: BookingStatusHistoryItem[] = [];
        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (typeof parsed === "object" && parsed !== null) {
                    history = [parsed];
                }
            } catch {
                if (details.booking.notes.trim()) {
                    history = [{
                        status: details.booking.status,
                        note: details.booking.notes,
                        timestamp: details.booking.updated_at.toISOString(),
                        authorName: null
                    }];
                }
            }
        }

        const advanceAmount = Number(details.booking.advance_amount || 0);
        const totalAmount = Number(details.booking.total_amount || 0);
        const remainingAmount = Math.max(0, totalAmount - advanceAmount);

        history.push({
            status: "COMPLETED",
            note: `Remaining balance of ₹${remainingAmount.toLocaleString("en-IN")} paid via Razorpay (Payment ID: ${input.razorpayPaymentId}).`,
            timestamp: new Date().toISOString(),
            authorName: "Customer"
        });

        const updated = await this._bookingRepository.update(details.booking.id, {
            status: "COMPLETED",
            paymentStatus: "PAID",
            notes: JSON.stringify(history)
        });

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update booking status", "INTERNAL");
        }

        await this._serviceRequestRepository.updateStatus(details.booking.service_request_id, "COMPLETED").catch(() => null);
        await this._providerRepository.incrementCompletedJobs(details.booking.provider_id).catch(() => null);

        if (this._creditWalletUseCase) {
            const profile = await this._providerRepository.findById(details.booking.provider_id);
            if (profile && profile.user_id) {
                const finalTotal = details.booking.total_amount;
                const earnings = Math.max(0, finalTotal - (details.booking.platform_fee || 0));
                if (earnings > 0) {
                    await this._creditWalletUseCase.execute({
                        userId: profile.user_id,
                        amount: earnings,
                        category: "EARNINGS",
                        bookingId: details.booking.id,
                        description: `Earnings for completed booking #${details.booking.booking_number}`,
                        referenceId: details.booking.booking_number
                    }).catch(() => null);
                }
            }
        }

        if (this._createNotificationUseCase) {
            const profile = await this._providerRepository.findById(details.booking.provider_id);
            if (profile) {
                await this._createNotificationUseCase.execute({
                    recipientId: profile.user_id,
                    type: "BOOKING_CONFIRMED",
                    title: "Booking Balance Settled & Completed!",
                    title_code: "BOOKING_CONFIRMED",
                    message: `Customer paid the remaining balance of ₹${remainingAmount.toLocaleString("en-IN")}. Booking #${details.booking.booking_number} is completed and earnings are credited to your wallet.`
                }).catch(() => null);
            }

            await this._createNotificationUseCase.execute({
                recipientId: input.customerId,
                type: "BOOKING_CONFIRMED",
                title: "Booking Completed!",
                title_code: "BOOKING_CONFIRMED",
                message: `Payment of ₹${remainingAmount.toLocaleString("en-IN")} successful. Booking #${details.booking.booking_number} is now marked as Completed.`
            }).catch(() => null);
        }

        return {
            success: true,
            bookingId: details.booking.id,
            status: "COMPLETED",
            paymentStatus: "PAID"
        };
    }
}
