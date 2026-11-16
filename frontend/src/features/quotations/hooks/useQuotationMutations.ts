import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitQuotationService,
  getQuotationByRequestId
} from "../services/quotation.service";
import type { SubmitQuotationPayload } from "../types/quotation.types";

export const useSubmitQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitQuotationPayload) => submitQuotationService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
    }
  });
};

export const useGetQuotationByRequestId = () => {
  return useMutation({
    mutationFn: (requestId: string) => getQuotationByRequestId(requestId)
  });
};
