import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ResolveWarrantyClaimInputDto } from "../dtos/request/warranty-claim.dto";
import { BookingResponseDto, BookingStatusHistoryItem, BookingWarrantyDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class ResolveWarrantyClaimUseCase implements IUseCase<ResolveWarrantyClaimInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: ResolveWarrantyClaimInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const profile = await this._providerRepository.findById(details.booking.provider_id);
        if (!profile || profile.user_id !== input.providerUserId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to respond to this warranty claim", "AUTHENTICATION");
        }

        let history: BookingStatusHistoryItem[] = [];
        let mismatchReport: any = null;
        let warranty: BookingWarrantyDto | null = null;

        if (details.booking.notes) {
            try {
                const parsed = JSON.parse(details.booking.notes);
                if (Array.isArray(parsed)) {
                    history = parsed;
                } else if (typeof parsed === "object" && parsed !== null) {
                    if (parsed.mismatchReport) {
                        mismatchReport = parsed.mismatchReport;
                    }
                    if (parsed.warranty) {
                        warranty = parsed.warranty;
                    }
                    if (Array.isArray(parsed.history)) {
                        history = parsed.history;
                    }
                }
            } catch {}
        }

        if (!warranty?.claim) {
            throw new ApplicationError("NO_PENDING_CLAIM", "No active warranty claim found for this booking", "VALIDATION");
        }

        const claim = warranty.claim;

        if (input.action === "ACCEPT") {
            if (!input.revisitScheduledDate) {
                throw new ApplicationError("DATE_REQUIRED", "Please provide a date for the free warranty re-visit", "VALIDATION");
            }
            claim.status = "ACCEPTED";
            claim.revisitScheduledDate = input.revisitScheduledDate;
            claim.revisitScheduledTime = input.revisitScheduledTime || null;
            claim.providerResponse = input.providerResponse?.trim() || null;

            history.push({
                status: details.booking.status,
                paymentStatus: details.booking.payment_status,
                note: `Provider accepted warranty claim and scheduled free re-visit on ${input.revisitScheduledDate}${input.revisitScheduledTime ? " at " + input.revisitScheduledTime : ""}`,
                timestamp: new Date().toISOString(),
                authorName: profile.business_name || "Provider"
            });

            if (this._createNotificationUseCase) {
                await this._createNotificationUseCase.execute({
                    recipientId: details.booking.customer_id,
                    type: "WARRANTY_CLAIM_ACCEPTED",
                    title: "Free Warranty Re-visit Scheduled",
                    title_code: "WARRANTY_CLAIM_ACCEPTED",
                    message: `Booking #${details.booking.booking_number}: Technician scheduled a free re-visit for ${input.revisitScheduledDate}.`
                }).catch(() => null);
            }
        } else if (input.action === "REJECT") {
            if (!input.rejectionReason || !input.rejectionReason.trim()) {
                throw new ApplicationError("REASON_REQUIRED", "Please provide a reason for disputing this claim", "VALIDATION");
            }
            claim.status = "REJECTED";
            claim.rejectionReason = input.rejectionReason.trim();
            claim.disputedAt = new Date().toISOString();

            history.push({
                status: details.booking.status,
                paymentStatus: details.booking.payment_status,
                note: `Provider disputed warranty claim: "${input.rejectionReason.trim()}". Escalated to Admin Support.`,
                timestamp: new Date().toISOString(),
                authorName: profile.business_name || "Provider"
            });

            if (this._createNotificationUseCase) {
                await this._createNotificationUseCase.execute({
                    recipientId: details.booking.customer_id,
                    type: "WARRANTY_CLAIM_DISPUTED",
                    title: "Warranty Claim Disputed",
                    title_code: "WARRANTY_CLAIM_DISPUTED",
                    message: `Booking #${details.booking.booking_number}: Technician disputed the claim. The dispute has been escalated for Admin investigation.`
                }).catch(() => null);
            }
        } else if (input.action === "RESOLVE") {
            claim.status = "RESOLVED";
            claim.resolvedAt = new Date().toISOString();

            history.push({
                status: details.booking.status,
                paymentStatus: details.booking.payment_status,
                note: "Warranty re-visit completed and service issue resolved",
                timestamp: new Date().toISOString(),
                authorName: profile.business_name || "Provider"
            });

            if (this._createNotificationUseCase) {
                await this._createNotificationUseCase.execute({
                    recipientId: details.booking.customer_id,
                    type: "WARRANTY_CLAIM_RESOLVED",
                    title: "Warranty Service Resolved",
                    title_code: "WARRANTY_CLAIM_RESOLVED",
                    message: `Booking #${details.booking.booking_number}: Warranty re-visit has been marked as resolved.`
                }).catch(() => null);
            }
        }

        const serializedNotes = JSON.stringify({
            history,
            mismatchReport,
            warranty
        });

        await this._bookingRepository.update(details.booking.id, {
            notes: serializedNotes
        });

        const updatedDetails = await this._bookingRepository.findDetailsById(details.booking.id);
        return BookingMapper.toResponseDto(updatedDetails || details);
    }
}
