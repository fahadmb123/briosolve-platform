import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { UpdateBookingStatusInputDto } from "../dtos/request/update-booking-status.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { db } from "../../../../shared/database/client";

export class UpdateBookingStatusUseCase implements IUseCase<UpdateBookingStatusInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: UpdateBookingStatusInputDto): Promise<BookingResponseDto> {
        const booking = await this._bookingRepository.findById(input.bookingId);
        if (!booking) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const providerProfile = await db.orm.public.provider_profiles
            .where({ id: booking.provider_id as never })
            .first();

        const isAuthorized =
            booking.customer_id === input.userId ||
            (providerProfile && providerProfile.user_id === input.userId);

        if (!isAuthorized) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to update this booking", "AUTHENTICATION");
        }

        const updated = await this._bookingRepository.update(booking.id, {
            status: input.status,
            notes: input.notes !== undefined ? input.notes : booking.notes
        });

        if (!updated) {
            throw new ApplicationError("UPDATE_FAILED", "Failed to update booking status", "INTERNAL");
        }

        let serviceRequestTitle: string | null = null;
        let providerBusinessName: string | null = null;
        let customerName: string | null = null;

        const sr = await db.orm.public.service_requests.where({ id: booking.service_request_id as never }).first();
        if (sr) {
            serviceRequestTitle = sr.title;
        }

        if (providerProfile) {
            providerBusinessName = providerProfile.business_name;
        }

        const cUser = await db.orm.public.users.where({ id: booking.customer_id as never }).first();
        if (cUser) {
            customerName = cUser.name;
        }

        if (this._createNotificationUseCase) {
            const isCustomerAction = booking.customer_id === input.userId;
            const targetRecipientId = isCustomerAction
                ? (providerProfile ? providerProfile.user_id : null)
                : booking.customer_id;

            if (targetRecipientId) {
                await this._createNotificationUseCase.execute({
                    recipientId: targetRecipientId,
                    type: "BOOKING_STATUS_UPDATED",
                    title: `Booking ${input.status}`,
                    title_code: "BOOKING_STATUS_UPDATED",
                    message: `Booking #${booking.booking_number} for "${serviceRequestTitle || "Service"}" has been marked as ${input.status}.`
                }).catch(() => null);
            }
        }

        return BookingMapper.toResponseDto(updated, {
            serviceRequestTitle,
            providerBusinessName,
            customerName
        });
    }
}
