import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { UpdateBookingStatusInputDto } from "../dtos/request/update-booking-status.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
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

        const updated = await this._bookingRepository.update(details.booking.id, {
            status: input.status,
            notes: input.notes !== undefined ? input.notes : details.booking.notes
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
                await this._createNotificationUseCase.execute({
                    recipientId: targetRecipientId,
                    type: "BOOKING_STATUS_UPDATED",
                    title: `Booking ${BookingStatusToTitle[input.status]}`,
                    title_code: "BOOKING_STATUS_UPDATED",
                    message: `Booking #${details.booking.booking_number} for "${details.serviceRequestTitle || "Service"}" has been marked as ${input.status}.`
                }).catch(() => null);
            }
        }

        return BookingMapper.toResponseDto(updatedDetails || updated);
    }
}
