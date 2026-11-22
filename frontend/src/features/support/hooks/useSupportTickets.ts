import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupportTicketApi, getMySupportTicketsApi, getAdminSupportTicketsApi } from "../services/support.service";
import type { CreateTicketPayload, GetSupportTicketsParams, GetAdminSupportTicketsParams } from "../services/support.service";

export const useGetMySupportTickets = (params?: GetSupportTicketsParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["mySupportTickets", params],
    queryFn: () => getMySupportTicketsApi(params),
    enabled: options?.enabled ?? true
  });
};

export const useGetAdminSupportTickets = (params?: GetAdminSupportTicketsParams, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["adminSupportTickets", params],
    queryFn: () => getAdminSupportTicketsApi(params),
    enabled: options?.enabled ?? true
  });
};

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => createSupportTicketApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySupportTickets"] });
    }
  });
};
