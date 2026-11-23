import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminBookings, adminUpdateBookingStatus } from "../services/booking.service";
import type { GetAdminBookingsQueryParams, BookingStatus } from "../types/booking.types";

export const useGetAdminBookings = (
  params?: GetAdminBookingsQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["adminBookings", params],
    queryFn: () => getAdminBookings(params),
    enabled: options?.enabled ?? true
  });
};

export const useAdminUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: BookingStatus; reason?: string } }) =>
      adminUpdateBookingStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    }
  });
};
