import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus,
  reportBookingMismatch,
  resolveBookingMismatch,
  reopenRequestWithDiagnosis
} from "../services/booking.service";
import type { GetBookingsQueryParams, UpdateBookingStatusPayload } from "../types/booking.types";

export const useGetCustomerBookings = (
  params?: GetBookingsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["customerBookings", params],
    queryFn: () => getCustomerBookings(params),
    enabled: options?.enabled ?? true
  });
};

export const useGetProviderBookings = (
  params?: GetBookingsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["providerBookings", params],
    queryFn: () => getProviderBookings(params),
    enabled: options?.enabled ?? true
  });
};

export const useGetBookingById = (id?: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => (id ? getBookingById(id) : Promise.reject("No id")),
    enabled: Boolean(id)
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingStatusPayload }) =>
      updateBookingStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["myQuotations"] });
    }
  });
};

export const useReportBookingMismatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { diagnosis: string; suggestedCategory?: string | null; suggestedCategoryId?: string | null } }) =>
      reportBookingMismatch(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
    }
  });
};

export const useResolveBookingMismatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "ACCEPT" | "DECLINE" }) =>
      resolveBookingMismatch(id, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["providerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
    }
  });
};

export const useReopenRequestWithDiagnosis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reopenRequestWithDiagnosis(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["customerBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
    }
  });
};
