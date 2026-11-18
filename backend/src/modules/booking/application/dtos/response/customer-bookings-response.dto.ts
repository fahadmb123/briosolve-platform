import { BookingResponseDto } from "./booking-response.dto";

export interface BookingCountsDto {
    ALL: number;
    CONFIRMED: number;
    EN_ROUTE?: number;
    INSPECTION?: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
}

export interface CustomerBookingsResponseDto {
    bookings: BookingResponseDto[];
    total: number;
    counts?: BookingCountsDto;
}
