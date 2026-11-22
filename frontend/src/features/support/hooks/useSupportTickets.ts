import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSupportTicketApi, getMySupportTicketsApi } from "../services/support.service";
import type { CreateTicketPayload } from "../services/support.service";

export const useGetMySupportTickets = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["mySupportTickets"],
    queryFn: () => getMySupportTicketsApi(),
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
