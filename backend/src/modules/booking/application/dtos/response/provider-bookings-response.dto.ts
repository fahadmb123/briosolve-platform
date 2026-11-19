import { BookingResponseDto } from "./booking-response.dto";
import { BookingCountsDto } from "./customer-bookings-response.dto";

export interface ProviderBookingsResponseDto {
    bookings: BookingResponseDto[];
    total: number;
    counts?: BookingCountsDto;
}
