import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  BookingItem,
  CustomerBookingsResponse,
  ProviderBookingsResponse,
  GetBookingsQueryParams,
  UpdateBookingStatusPayload
} from "../types/booking.types";

export const getCustomerBookings = async (
  params?: GetBookingsQueryParams
): Promise<response<CustomerBookingsResponse>> => {
  const res = await apiClient.get<response<CustomerBookingsResponse>>("/api/booking/customer", {
    params
  });
  return res.data;
};

export const getProviderBookings = async (
  params?: GetBookingsQueryParams
): Promise<response<ProviderBookingsResponse>> => {
  const res = await apiClient.get<response<ProviderBookingsResponse>>("/api/booking/provider", {
    params
  });
  return res.data;
};

export const getBookingById = async (id: string): Promise<response<BookingItem>> => {
  const res = await apiClient.get<response<BookingItem>>(`/api/booking/${id}`);
  return res.data;
};

export const updateBookingStatus = async (
  id: string,
  payload: UpdateBookingStatusPayload
): Promise<response<BookingItem>> => {
  const res = await apiClient.patch<response<BookingItem>>(`/api/booking/${id}/status`, payload);
  return res.data;
};

export const reportBookingMismatch = async (
  id: string,
  payload: { diagnosis: string; visitFee?: number; suggestedCategory?: string | null; suggestedCategoryId?: string | null }
): Promise<response<BookingItem>> => {
  const res = await apiClient.post<response<BookingItem>>(`/api/booking/${id}/mismatch-report`, payload);
  return res.data;
};

export const resolveBookingMismatch = async (
  id: string,
  action: "ACCEPT" | "DECLINE"
): Promise<response<BookingItem>> => {
  const res = await apiClient.post<response<BookingItem>>(`/api/booking/${id}/mismatch-resolve`, { action });
  return res.data;
};

export const reopenRequestWithDiagnosis = async (
  id: string
): Promise<response<{ serviceRequestId: string; message: string }>> => {
  const res = await apiClient.post<response<{ serviceRequestId: string; message: string }>>(`/api/booking/${id}/reopen-request`);
  return res.data;
};
