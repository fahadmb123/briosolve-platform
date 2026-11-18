import { BookingResponseDto } from "./booking-response.dto";

export interface CustomerBookingsResponseDto {
    bookings: BookingResponseDto[];
    total: number;
}
