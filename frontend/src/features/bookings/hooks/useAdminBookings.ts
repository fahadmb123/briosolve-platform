import { useQuery } from "@tanstack/react-query";
import { getAdminBookings } from "../services/booking.service";
import type { GetAdminBookingsQueryParams } from "../types/booking.types";

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
