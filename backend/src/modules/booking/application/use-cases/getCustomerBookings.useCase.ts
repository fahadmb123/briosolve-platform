import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import { GetCustomerBookingsInputDto } from "../dtos/request/get-booking.dto";
import { CustomerBookingsResponseDto } from "../dtos/response/customer-bookings-response.dto";
import { BookingMapper } from "../../infrastructure/mappers/booking.mapper";

export class GetCustomerBookingsUseCase implements IUseCase<GetCustomerBookingsInputDto, CustomerBookingsResponseDto> {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(input: GetCustomerBookingsInputDto): Promise<CustomerBookingsResponseDto> {
        const result = await this._bookingRepository.findByCustomerId(input);
        return BookingMapper.toCustomerBookingsResponseDto(result);
    }
}
