import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { GetBookingByIdInputDto } from "../dtos/request/get-booking.dto";
import { BookingResponseDto } from "../dtos/response/booking-response.dto";
import { BookingMapper, calculateCancellationPolicy } from "../mappers/booking.mapper";

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

        const isCustomer = details.booking.customer_id === input.userId;
        const isProvider = Boolean(providerProfile && providerProfile.id === details.booking.provider_id);

        if (!isCustomer && !isProvider) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to view this booking", "AUTHENTICATION");
        }

        const role = isCustomer ? "CUSTOMER" : "PROVIDER";
        let cancellationsUsed = 0;
        if (isCustomer) {
            cancellationsUsed = await this._bookingRepository.countCustomerCancellations(input.userId);
        } else {
            cancellationsUsed = await this._bookingRepository.countProviderCancellations(details.booking.provider_id);
        }

        const advanceAmount = details.booking.advance_amount && details.booking.advance_amount > 0
            ? details.booking.advance_amount
            : details.booking.total_amount;

        details.providerCancellationsCount = cancellationsUsed;
        details.maxAllowedCancellations = 2;
        details.cancellationPolicy = calculateCancellationPolicy({
            role,
            status: details.booking.status,
            quotationType: details.quotationType,
            advancePaid: advanceAmount,
            cancellationsUsed,
            maxAllowedCancellations: 2
        });

        return BookingMapper.toResponseDto(details);
    }
}
