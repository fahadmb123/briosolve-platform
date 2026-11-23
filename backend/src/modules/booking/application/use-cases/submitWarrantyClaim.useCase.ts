import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { SubmitWarrantyClaimInputDto } from "../dtos/request/warranty-claim.dto";
import { BookingResponseDto, BookingStatusHistoryItem, BookingWarrantyDto, WarrantyClaimDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class SubmitWarrantyClaimUseCase implements IUseCase<SubmitWarrantyClaimInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: SubmitWarrantyClaimInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        if (details.booking.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to submit a warranty claim for this booking", "AUTHENTICATION");
        }

        if (details.booking.status !== "COMPLETED") {
            throw new ApplicationError("INVALID_STATE", "Warranty claims can only be filed for completed bookings", "VALIDATION");
        }

        if (!input.issueDescription || !input.issueDescription.trim()) {
            throw new ApplicationError("DESCRIPTION_REQUIRED", "Please provide a detailed description of the issue", "VALIDATION");
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

        if (!warranty || !warranty.days || warranty.days <= 0) {
            throw new ApplicationError("NO_WARRANTY", "This service does not have an active warranty", "VALIDATION");
        }

        if (warranty.expiresAt && new Date(warranty.expiresAt).getTime() < Date.now()) {
            throw new ApplicationError("WARRANTY_EXPIRED", "The warranty protection period for this service has expired", "VALIDATION");
        }

        if (warranty.claim && (warranty.claim.status === "PENDING" || warranty.claim.status === "ACCEPTED")) {
            throw new ApplicationError("CLAIM_ALREADY_ACTIVE", "A warranty claim is already currently in progress for this booking", "VALIDATION");
        }

        const newClaim: WarrantyClaimDto = {
            status: "PENDING",
            issueDescription: input.issueDescription.trim(),
            proofImages: input.proofImages || [],
            preferredDate: input.preferredDate || null,
            preferredTime: input.preferredTime || null,
            reportedAt: new Date().toISOString()
        };

        warranty.claim = newClaim;

        history.push({
            status: details.booking.status,
            paymentStatus: details.booking.payment_status,
            note: `Customer filed warranty claim: "${input.issueDescription.trim().slice(0, 100)}"`,
            timestamp: new Date().toISOString(),
            authorName: details.customerName || "Customer"
        });

        const serializedNotes = JSON.stringify({
            history,
            mismatchReport,
            warranty
        });

        await this._bookingRepository.update(details.booking.id, {
            notes: serializedNotes
        });

        const profile = await this._providerRepository.findById(details.booking.provider_id);
        if (profile?.user_id && this._createNotificationUseCase) {
            await this._createNotificationUseCase.execute({
                recipientId: profile.user_id,
                type: "WARRANTY_CLAIM_SUBMITTED",
                title: "Warranty Issue Reported",
                title_code: "WARRANTY_CLAIM_SUBMITTED",
                message: `Customer reported an issue under warranty for booking #${details.booking.booking_number}. Please review the claim.`
            }).catch(() => null);
        }

        const updatedDetails = await this._bookingRepository.findDetailsById(details.booking.id);
        return BookingMapper.toResponseDto(updatedDetails || details);
    }
}
