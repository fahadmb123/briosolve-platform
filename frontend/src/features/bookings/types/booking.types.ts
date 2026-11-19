export type BookingStatus = "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "PAYMENT_PENDING" | "COMPLETED" | "CANCELLED";

export type BookingPaymentStatus = "PENDING" | "ADVANCE_PAID" | "PAID" | "REFUNDED";

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  note: string;
  timestamp: string;
  authorName?: string | null;
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
}

export interface BookingCounts {
  ALL: number;
  CONFIRMED: number;
  EN_ROUTE?: number;
  INSPECTION?: number;
  IN_PROGRESS: number;
  PAYMENT_PENDING?: number;
  COMPLETED: number;
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

export type BookingFilterTab = "ALL" | "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "PAYMENT_PENDING" | "COMPLETED" | "CANCELLED";
