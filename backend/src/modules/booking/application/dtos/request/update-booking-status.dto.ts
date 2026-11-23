import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";

export interface UpdateBookingStatusInputDto {
    bookingId: string;
    userId: string;
    status: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
    totalAmount?: number;
    warrantyDays?: number;
    warrantyTerms?: string;
}

export interface UpdateBookingRepoDto {
    status?: BookingStatus;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
    totalAmount?: number;
    warrantyDays?: number | null;
    warrantyExpiresAt?: Date | string | null;
}

export interface AdminUpdateBookingStatusInputDto {
    bookingId: string;
    status: BookingStatus;
    reason?: string;
}
