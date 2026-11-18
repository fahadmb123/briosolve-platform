import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";

export interface UpdateBookingStatusInputDto {
    bookingId: string;
    userId: string;
    status: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
}

export interface UpdateBookingRepoDto {
    status?: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
}
