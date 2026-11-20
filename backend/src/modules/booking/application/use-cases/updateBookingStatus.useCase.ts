import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { UpdateBookingStatusInputDto } from "../dtos/request/update-booking-status.dto";
import { BookingResponseDto, BookingStatusHistoryItem } from "../dtos/response/booking-response.dto";
import { BookingMapper, BookingStatusToTitle, calculateCancellationPolicy } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IQuotationRepository } from "../../../quotation-submission/domain/repositories/IQuotationRepository";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";

export class UpdateBookingStatusUseCase implements IUseCase<UpdateBookingStatusInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
        private readonly _creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
    ) {}

    async execute(input: UpdateBookingStatusInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const providerProfile = await this._providerRepository.findProfileByUserId(input.userId);

        const isProviderAction = Boolean(
            (providerProfile && providerProfile.id === details.booking.provider_id) ||
            details.booking.provider_id === input.userId ||
            (providerProfile && providerProfile.user_id === details.booking.provider_id) ||
            details.providerUserId === input.userId
        );
        const isCustomerAction = details.booking.customer_id === input.userId;

        const isAuthorized = isCustomerAction || isProviderAction;

        if (!isAuthorized) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to update this booking", "AUTHENTICATION");
        }

        if (isCustomerAction && input.status !== "CANCELLED") {
            throw new ApplicationError("FORBIDDEN", "Customers can only cancel bookings.", "AUTHENTICATION");
        }

        if (input.status === "CANCELLED") {
            if (isProviderAction) {
                if (details.booking.status !== "CONFIRMED") {
                    throw new ApplicationError("CANNOT_CANCEL", "Provider can only cancel before dispatching or travelling.", "VALIDATION");
                }
                const priorCancellations = await this._bookingRepository.countProviderCancellations(details.booking.provider_id);
                if (priorCancellations >= 2) {
                    throw new ApplicationError("PROVIDER_CANCELLATION_LIMIT_EXCEEDED", "You have already reached the maximum limit of 2 cancellations. You cannot cancel this booking.", "VALIDATION");
                }
            } else if (isCustomerAction) {
                if (details.booking.status !== "CONFIRMED" && details.booking.status !== "EN_ROUTE") {
                    throw new ApplicationError("CANNOT_CANCEL", "Booking cannot be cancelled once work or inspection has commenced.", "VALIDATION");
                }
            }
            if (!input.notes || !input.notes.trim()) {
                throw new ApplicationError("CANCELLATION_REASON_REQUIRED", "Please provide a reason for cancelling this booking.", "VALIDATION");
            }
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
                authorName: isProviderAction ? (providerProfile?.business_name || "Provider") : "Customer"
            });
        }

        const serializedNotes = history.length > 0 ? JSON.stringify(history) : details.booking.notes;

        const nextPaymentStatus = input.paymentStatus || (
            input.status === "COMPLETED"
                ? "PAID"
                : input.status === "CANCELLED"
                    ? "REFUNDED"
                    : details.booking.payment_status
        );

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

        if (input.status === "CANCELLED") {
            const cancelActorName = isProviderAction ? (providerProfile?.business_name || "Provider") : "Customer";
            await this._serviceRequestRepository.updateStatus(details.booking.service_request_id, "EXPIRED").catch(() => null);
            await this._quotationRepository.update(details.booking.quotation_id, {
                status: "WITHDRAWN",
                rejectionReason: `Booking cancelled by ${cancelActorName}: ${input.notes || "No cancellation reason provided"}`
            }).catch(() => null);
            const advancePaid = details.booking.advance_amount && details.booking.advance_amount > 0
                ? details.booking.advance_amount
                : details.booking.total_amount;

            if (this._creditWalletUseCase && advancePaid > 0) {
                if (isProviderAction) {
                    await this._creditWalletUseCase.execute({
                        userId: details.booking.customer_id,
                        amount: advancePaid,
                        category: "REFUND",
                        bookingId: details.booking.id,
                        description: `Refund for cancelled booking #${details.booking.booking_number}`,
                        referenceId: details.booking.booking_number
                    }).catch(() => null);
                } else {
                    const priorCustomerCancellations = await this._bookingRepository.countCustomerCancellations(details.booking.customer_id);
                    const policy = calculateCancellationPolicy({
                        role: "CUSTOMER",
                        status: details.booking.status,
                        quotationType: details.quotationType,
                        advancePaid,
                        cancellationsUsed: priorCustomerCancellations,
                        maxAllowedCancellations: 2
                    });

                    if (policy.refundableAmount > 0) {
                        await this._creditWalletUseCase.execute({
                            userId: details.booking.customer_id,
                            amount: policy.refundableAmount,
                            category: "REFUND",
                            bookingId: details.booking.id,
                            description: `Refund for cancelled booking #${details.booking.booking_number}`,
                            referenceId: details.booking.booking_number
                        }).catch(() => null);
                    }

                    if (policy.cancellationFee > 0) {
                        const providerProfileRecord = await this._providerRepository.findById(details.booking.provider_id);
                        if (providerProfileRecord && providerProfileRecord.user_id) {
                            await this._creditWalletUseCase.execute({
                                userId: providerProfileRecord.user_id,
                                amount: policy.cancellationFee,
                                category: "EARNINGS",
                                bookingId: details.booking.id,
                                description: `Cancellation compensation fee for booking #${details.booking.booking_number}`,
                                referenceId: details.booking.booking_number
                            }).catch(() => null);
                        }
                    }
                }
            }
        }

        if (input.status === "COMPLETED" && this._creditWalletUseCase) {
            const profile = await this._providerRepository.findById(details.booking.provider_id);
            if (profile && profile.user_id) {
                const finalTotal = resolvedTotalAmount || details.booking.total_amount;
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

        const updatedDetails = await this._bookingRepository.findDetailsById(updated.id);

        if (this._createNotificationUseCase) {
            let targetRecipientId: string | null = null;

            if (isCustomerAction) {
                const profile = await this._providerRepository.findById(details.booking.provider_id);
                targetRecipientId = profile ? profile.user_id : null;
            } else {
                targetRecipientId = details.booking.customer_id;
            }

            if (targetRecipientId) {
                let message: string;
                let title = `Booking ${BookingStatusToTitle[input.status] || input.status}`;
                let type = "BOOKING_STATUS_UPDATED";

                if (input.status === "CANCELLED") {
                    type = "BOOKING_CANCELLED";
                    if (isProviderAction) {
                        title = "Booking Cancelled by Provider";
                        message = `Booking #${details.booking.booking_number} for "${details.serviceRequestTitle || "Service"}" was cancelled by the provider. Reason: ${input.notes || "Emergency / Schedule conflict"}. A full refund has been initiated to your account.`;
                    } else {
                        title = "Booking Cancelled by Customer";
                        message = `Booking #${details.booking.booking_number} for "${details.serviceRequestTitle || "Service"}" was cancelled by the customer before dispatch. Reason: ${input.notes || "Customer requested cancellation"}.`;
                    }
                } else if (input.status === "PAYMENT_PENDING") {
                    message = `Booking #${details.booking.booking_number} total confirmed at ₹${(resolvedTotalAmount || details.booking.total_amount).toLocaleString("en-IN")}. Please review and settle the remaining balance.`;
                } else {
                    message = `Booking #${details.booking.booking_number} for "${details.serviceRequestTitle || "Service"}" has been marked as ${input.status}.`;
                }

                await this._createNotificationUseCase.execute({
                    recipientId: targetRecipientId,
                    type,
                    title,
                    title_code: type,
                    message
                }).catch(() => null);
            }
        }

        return BookingMapper.toResponseDto(updatedDetails || updated);
    }
}
