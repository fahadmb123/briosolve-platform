import { BookingStatus, BookingPaymentStatus } from "../../../domain/entities/booking.entity";
import { CancellationPolicyDetails } from "../../../domain/repositories/IBookingRepository";

export interface BookingStatusHistoryItem {
    status: BookingStatus;
    paymentStatus?: BookingPaymentStatus;
    note: string;
    timestamp: string;
    authorName?: string | null;
}

export interface MismatchReport {
    status: "PENDING" | "ACCEPTED" | "DECLINED";
    diagnosis: string;
    suggestedCategory?: string | null;
    suggestedCategoryId?: string | null;
    visitFee: number;
    refundAmount: number;
    reportedAt: string;
    resolvedAt?: string | null;
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
    providerEmail?: string | null;
    providerPhone?: string | null;
    providerUserId?: string | null;
    customerName?: string | null;
    customerEmail?: string | null;
    customerPhone?: string | null;
    quotationType?: string | null;
    requiresInspection?: boolean;
    quoteAmount?: number | null;
    isFinalConfirmed?: boolean;
    statusHistory?: BookingStatusHistoryItem[];
    providerCancellationsCount?: number;
    maxAllowedCancellations?: number;
    cancellationPolicy?: CancellationPolicyDetails;
    mismatchReport?: MismatchReport | null;
    warranty?: BookingWarrantyDto | null;
}

export interface WarrantyClaimDto {
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "RESOLVED";
    issueDescription: string;
    proofImages?: string[];
    preferredDate?: string | null;
    preferredTime?: string | null;
    reportedAt: string;
    providerResponse?: string | null;
    revisitScheduledDate?: string | null;
    revisitScheduledTime?: string | null;
    rejectionReason?: string | null;
    disputedAt?: string | null;
    resolvedAt?: string | null;
}

export interface BookingWarrantyDto {
    days: number;
    terms?: string | null;
    expiresAt?: string | null;
    claim?: WarrantyClaimDto | null;
}
