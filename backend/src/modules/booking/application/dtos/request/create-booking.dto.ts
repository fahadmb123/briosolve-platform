import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";

export interface CreateBookingInputDto {
    serviceRequestId: string;
    quotationId: string;
    customerId: string;
    providerId: string;
    totalAmount: number;
    platformFee: number;
    scheduledDate?: Date | string | null;
    scheduledTime?: string | null;
    paymentId?: string | null;
    orderId?: string | null;
    notes?: string | null;
    paymentStatus?: BookingPaymentStatus;
}

export interface CreateBookingRepoDto {
    bookingNumber: string;
    serviceRequestId: string;
    quotationId: string;
    customerId: string;
    providerId: string;
    totalAmount: number;
    platformFee: number;
    status?: BookingStatus;
    paymentStatus?: BookingPaymentStatus;
    scheduledDate?: Date | null;
    scheduledTime?: string | null;
    paymentId?: string | null;
    orderId?: string | null;
    notes?: string | null;
}
