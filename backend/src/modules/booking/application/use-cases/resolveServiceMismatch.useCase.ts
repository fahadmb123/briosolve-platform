import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { ResolveServiceMismatchInputDto } from "../dtos/request/mismatch-report.dto";
import { BookingResponseDto, BookingStatusHistoryItem, MismatchReport } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class ResolveServiceMismatchUseCase implements IUseCase<ResolveServiceMismatchInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: ResolveServiceMismatchInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        if (details.booking.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to respond to this report", "AUTHENTICATION");
        }

        let history: BookingStatusHistoryItem[] = [];
        let mismatchReport: MismatchReport | null = null;

        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (typeof parsed === "object" && parsed !== null) {
                    if (parsed.mismatchReport) {
                        mismatchReport = parsed.mismatchReport;
                    }
                    if (Array.isArray(parsed.history)) {
                        history = parsed.history;
                    }
                }
            } catch {}
        }

        if (!mismatchReport || mismatchReport.status !== "PENDING") {
            throw new ApplicationError("NO_PENDING_REPORT", "No pending scope mismatch report found for this booking", "VALIDATION");
        }

        const profile = await this._providerRepository.findById(details.booking.provider_id);

        if (input.action === "ACCEPT") {
            mismatchReport.status = "ACCEPTED";
            mismatchReport.resolvedAt = new Date().toISOString();

            if (profile?.user_id && mismatchReport.visitFee > 0 && this._creditWalletUseCase) {
                await this._creditWalletUseCase.execute({
                    userId: profile.user_id,
                    amount: mismatchReport.visitFee,
                    category: "EARNINGS",
                    bookingId: details.booking.id,
                    description: `Visit & diagnostic fee for booking #${details.booking.booking_number} (Service Scope Mismatch)`,
                    referenceId: details.booking.booking_number
                }).catch(() => null);
            }

            if (mismatchReport.refundAmount > 0 && this._creditWalletUseCase) {
                await this._creditWalletUseCase.execute({
                    userId: details.booking.customer_id,
                    amount: mismatchReport.refundAmount,
                    category: "REFUND",
                    bookingId: details.booking.id,
                    description: `Deposit refund for booking #${details.booking.booking_number} (Service Scope Mismatch)`,
                    referenceId: details.booking.booking_number
                }).catch(() => null);
            }

            history.push({
                status: "CLOSED",
                note: `Technician on-site diagnosis accepted: "${mismatchReport.diagnosis}". Booking closed (exempt from cancellation count). Visit fee of ₹${mismatchReport.visitFee} settled and ₹${mismatchReport.refundAmount} refunded.`,
                timestamp: new Date().toISOString(),
                authorName: "System (Diagnosis Closed)"
            });

            await this._bookingRepository.update(details.booking.id, {
                status: "CLOSED",
                paymentStatus: "REFUNDED",
                notes: JSON.stringify({
                    history,
                    mismatchReport
                })
            });

            await this._serviceRequestRepository.updateStatus(details.booking.service_request_id, "CLOSED").catch(() => null);

            if (profile?.user_id && this._createNotificationUseCase) {
                await this._createNotificationUseCase.execute({
                    recipientId: profile.user_id,
                    type: "SERVICE_MISMATCH_ACCEPTED",
                    title: "Diagnosis Accepted by Customer",
                    title_code: "SERVICE_MISMATCH_ACCEPTED",
                    message: `Booking #${details.booking.booking_number}: Customer accepted your diagnosis report. Visit fee of ₹${mismatchReport.visitFee} has been credited to your wallet.`
                }).catch(() => null);
            }
        } else {
            mismatchReport.status = "DECLINED";
            mismatchReport.resolvedAt = new Date().toISOString();

            history.push({
                status: details.booking.status,
                note: `Customer declined the scope mismatch report. Work remains active.`,
                timestamp: new Date().toISOString(),
                authorName: details.customerName || "Customer"
            });

            await this._bookingRepository.update(details.booking.id, {
                notes: JSON.stringify({
                    history,
                    mismatchReport
                })
            });

            if (profile?.user_id && this._createNotificationUseCase) {
                await this._createNotificationUseCase.execute({
                    recipientId: profile.user_id,
                    type: "SERVICE_MISMATCH_DECLINED",
                    title: "Diagnosis Report Declined",
                    title_code: "SERVICE_MISMATCH_DECLINED",
                    message: `Booking #${details.booking.booking_number}: Customer declined the scope mismatch report. You may coordinate via chat.`
                }).catch(() => null);
            }
        }

        const updatedDetails = await this._bookingRepository.findDetailsById(details.booking.id);
        return BookingMapper.toResponseDto(updatedDetails || details);
    }
}
