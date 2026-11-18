import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerBookings,
  getProviderBookings,
  getBookingById,
  updateBookingStatus
} from "../services/booking.service";
import type { UpdateBookingStatusPayload } from "../types/booking.types";

export const useGetCustomerBookings = () => {
  return useQuery({
    queryKey: ["customerBookings"],
    queryFn: getCustomerBookings
  });
};

export const useGetProviderBookings = () => {
  return useQuery({
    queryKey: ["providerBookings"],
    queryFn: getProviderBookings
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
    }
  });
};
