import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";

export interface BookingStatusHistoryItem {
    status: BookingStatus;
    paymentStatus?: BookingPaymentStatus;
    note: string;
    timestamp: string;
    authorName?: string | null;
}

export interface BookingResponseDto {
    id: string;
    bookingNumber: string;
    serviceRequestId: string;
    quotationId: string;
    customerId: string;
    providerId: string;
    totalAmount: number;
    platformFee: number;
    status: BookingStatus;
    paymentStatus: BookingPaymentStatus;
    scheduledDate: string | null;
    scheduledTime: string | null;
    paymentId: string | null;
    orderId: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    serviceRequestTitle?: string | null;
    categoryName?: string | null;
    addressText?: string | null;
    providerBusinessName?: string | null;
    providerName?: string | null;
    providerPhone?: string | null;
    providerUserId?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    quotationType?: string | null;
    requiresInspection?: boolean;
    statusHistory?: BookingStatusHistoryItem[];
}
