import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { GetBookingByIdInputDto } from "../dtos/request/get-booking.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";

export class GetBookingByIdUseCase implements IUseCase<GetBookingByIdInputDto, BookingResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _providerRepository: IProviderRepository
    ) {}

    async execute(input: GetBookingByIdInputDto): Promise<BookingResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        const providerProfile = await this._providerRepository.findProfileByUserId(input.userId);

        const isAuthorized =
            details.booking.customer_id === input.userId ||
            (providerProfile && providerProfile.id === details.booking.provider_id);

        if (!isAuthorized) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to view this booking", "AUTHENTICATION");
        }

        return BookingMapper.toResponseDto(details);
    }
}
