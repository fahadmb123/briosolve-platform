export type BookingStatus = "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "PAYMENT_PENDING" | "COMPLETED" | "CANCELLED" | "CLOSED";

export type BookingPaymentStatus = "PENDING" | "ADVANCE_PAID" | "PAID" | "REFUNDED";

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  note: string;
  timestamp: string;
  authorName?: string | null;
}

export interface CancellationPolicyDetails {
  cancellationsUsed: number;
  maxAllowedCancellations: number;
  totalAdvancePaid: number;
  refundableAmount: number;
  cancellationFee: number;
  isFullRefund: boolean;
  policyStatus: "FREE_CANCELLATION" | "FINAL_FREE_CANCELLATION" | "LIMIT_EXCEEDED" | "EN_ROUTE_FEE";
  policyMessage: string;
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

export interface BookingItem {
  id: string;
  bookingNumber: string;
  serviceRequestId: string;
  quotationId: string;
  customerId: string;
  providerId: string;
  totalAmount: number;
  platformFee: number;
  advanceAmount?: number;
  remainingAmount?: number;
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
  quotationType?: "FIXED" | "ESTIMATED" | "INSPECTION_REQUIRED" | string | null;
  requiresInspection?: boolean;
  quoteAmount?: number | null;
  isFinalConfirmed?: boolean;
  statusHistory?: BookingStatusHistoryItem[];
  providerCancellationsCount?: number;
  maxAllowedCancellations?: number;
  cancellationPolicy?: CancellationPolicyDetails;
  mismatchReport?: MismatchReport | null;
}

export interface BookingCounts {
  ALL: number;
  CONFIRMED: number;
  EN_ROUTE?: number;
  INSPECTION?: number;
  IN_PROGRESS: number;
  PAYMENT_PENDING?: number;
  COMPLETED: number;
  CLOSED?: number;
  CANCELLED: number;
}

export interface GetBookingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface CustomerBookingsResponse {
  bookings: BookingItem[];
  total: number;
  counts?: BookingCounts;
}

export interface ProviderBookingsResponse {
  bookings: BookingItem[];
  total: number;
  counts?: BookingCounts;
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus;
  notes?: string | null;
  paymentStatus?: BookingPaymentStatus;
  totalAmount?: number;
}

export type BookingFilterTab = "ALL" | "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "PAYMENT_PENDING" | "COMPLETED" | "CLOSED" | "CANCELLED";

export interface AdminBookingItem extends BookingItem {
  customerEmail?: string | null;
  providerEmail?: string | null;
}

export interface AdminBookingsStats {
  total: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalPlatformFees: number;
}

export interface AdminBookingsResponse {
  bookings: AdminBookingItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats?: AdminBookingsStats;
}

export interface GetAdminBookingsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}
