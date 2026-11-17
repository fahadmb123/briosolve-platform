import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitQuotationService,
  updateQuotationService,
  getQuotationByRequestId,
  getMyQuotationsService
} from "../services/quotation.service";
import type { SubmitQuotationPayload, UpdateQuotationPayload, GetMyQuotationsParams } from "../types/quotation.types";

export const useSubmitQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitQuotationPayload) => submitQuotationService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["myQuotations"] });
    }
  });
};

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: UpdateQuotationPayload) => updateQuotationService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      queryClient.invalidateQueries({ queryKey: ["myQuotations"] });
    }
  });
};

export const useGetQuotationByRequestId = () => {
  return useMutation({
    mutationFn: (requestId: string) => getQuotationByRequestId(requestId)
  });
};

export const useGetMyQuotations = () => {
  return useMutation({
    mutationFn: (params?: GetMyQuotationsParams) => getMyQuotationsService(params)
  });
};
