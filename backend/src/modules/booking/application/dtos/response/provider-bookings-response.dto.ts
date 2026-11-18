import { BookingResponseDto } from "./booking-response.dto";

export interface ProviderBookingsResponseDto {
    bookings: BookingResponseDto[];
    total: number;
}
