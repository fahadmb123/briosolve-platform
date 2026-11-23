import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";

export interface UpdateBookingStatusInputDto {
    bookingId: string;
    userId: string;
    status: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
    totalAmount?: number;
}

export interface UpdateBookingRepoDto {
    status?: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
    totalAmount?: number;
}

export interface AdminUpdateBookingStatusInputDto {
    bookingId: string;
    status: BookingStatus;
    reason?: string;
}
