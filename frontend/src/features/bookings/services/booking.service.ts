import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  BookingItem,
  CustomerBookingsResponse,
  ProviderBookingsResponse,
  UpdateBookingStatusPayload
} from "../types/booking.types";

export const getCustomerBookings = async (): Promise<response<CustomerBookingsResponse>> => {
  const res = await apiClient.get<response<CustomerBookingsResponse>>("/api/booking/customer");
  return res.data;
};

export const getProviderBookings = async (): Promise<response<ProviderBookingsResponse>> => {
  const res = await apiClient.get<response<ProviderBookingsResponse>>("/api/booking/provider");
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
