import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";
import { CancellationPolicyDetails } from "../../../domain/repositories/IBookingRepository";

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
    advanceAmount: number;
    remainingAmount: number;
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
    quoteAmount?: number | null;
    isFinalConfirmed?: boolean;
    statusHistory?: BookingStatusHistoryItem[];
    providerCancellationsCount?: number;
    maxAllowedCancellations?: number;
    cancellationPolicy?: CancellationPolicyDetails;
}
