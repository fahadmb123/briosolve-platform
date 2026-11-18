import { BookingStatus } from "../../../domain/entities/booking.entity";

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
    customerName?: string | null;
    customerPhone?: string | null;
}
