export type BookingStatus = "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

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
  providerUserId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  quotationType?: "FIXED" | "ESTIMATED" | "INSPECTION_REQUIRED" | string | null;
  requiresInspection?: boolean;
  statusHistory?: BookingStatusHistoryItem[];
}

export interface BookingCounts {
  ALL: number;
  CONFIRMED: number;
  EN_ROUTE?: number;
  INSPECTION?: number;
  IN_PROGRESS: number;
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
}

export type BookingFilterTab = "ALL" | "CONFIRMED" | "EN_ROUTE" | "INSPECTION" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
