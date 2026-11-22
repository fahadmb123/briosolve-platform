import { BookingResponseDto } from "./booking-response.dto";

export interface AdminBookingsResponseDto {
    bookings: BookingResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
