import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { CreateBookingInputDto } from "../dtos/request/create-booking.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export class CreateBookingUseCase implements IUseCase<CreateBookingInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository?: IProviderRepository,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: CreateBookingInputDto): Promise<BookingResponseDto> {
        const existingBooking = await this._bookingRepository.findByQuotationId(input.quotationId);
        if (existingBooking) {
            const existingDetails = await this._bookingRepository.findDetailsById(existingBooking.id);
            return BookingMapper.toResponseDto(existingDetails || existingBooking);
        }

        const createRepoDto = BookingMapper.fromInputToCreateRepoDto(input);
        const booking = await this._bookingRepository.create(createRepoDto);

        if (!booking) {
            throw new ApplicationError("BOOKING_CREATION_FAILED", "Failed to create booking", "INTERNAL");
        }

        const details = await this._bookingRepository.findDetailsById(booking.id);
        const responseData = details || booking;

        if (this._createNotificationUseCase) {
            let providerUserId: string | null = null;
            if (this._providerRepository) {
                const profile = await this._providerRepository.findById(input.providerId);
                if (profile) {
                    providerUserId = profile.user_id;
                }
            }

            if (providerUserId) {
                await this._createNotificationUseCase.execute({
                    recipientId: providerUserId,
                    type: "BOOKING_CREATED",
                    title: "New Booking Confirmed!",
                    title_code: "BOOKING_CREATED",
                    message: `New booking #${booking.booking_number} confirmed for "${details?.serviceRequestTitle || "Service Request"}". Customer: ${details?.customerName || "Customer"}. Amount: ₹${booking.total_amount}.`
                }).catch(() => null);
            }

            await this._createNotificationUseCase.execute({
                recipientId: input.customerId,
                type: "BOOKING_CONFIRMED",
                title: "Booking Confirmed!",
                title_code: "BOOKING_CONFIRMED",
                message: `Payment successful! Your booking #${booking.booking_number} with ${details?.providerBusinessName || details?.providerName || "Service Provider"} is confirmed with 15-day service warranty.`
            }).catch(() => null);
        }

        return BookingMapper.toResponseDto(responseData);
    }
}
