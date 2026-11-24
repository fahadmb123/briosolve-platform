import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { IBookingRepository, GetAdminBookingsInputDto } from "../../domain/repositories/IBookingRepository";
import { AdminBookingsResponseDto } from "../dtos/response/admin-bookings-response.dto";
import { BookingMapper } from "../mappers/booking.mapper";

export class GetAdminBookingsUseCase implements IUseCase<GetAdminBookingsInputDto, AdminBookingsResponseDto> {
    constructor(private readonly _bookingRepository: IBookingRepository) {}

    async execute(input: GetAdminBookingsInputDto): Promise<AdminBookingsResponseDto> {
        const result = await this._bookingRepository.findForAdmin(input);
        return {
            bookings: result.bookings.map((b) => BookingMapper.toResponseDto(b)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages
        };
    }
}
