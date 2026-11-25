import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  submitQuotationService,
  updateQuotationService,
  getQuotationByRequestId,
  getMyQuotationsService,
  getRequestQuotationsService,
  acceptQuotationService,
  rejectQuotationService,
  compareQuotationsWithAiService
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

export const useGetQuotationByRequestId = (requestId?: string) => {
  return useQuery({
    queryKey: ["quotationByRequestId", requestId],
    queryFn: () => (requestId ? getQuotationByRequestId(requestId) : Promise.reject("No requestId")),
    enabled: Boolean(requestId)
  });
};

export const useGetMyQuotations = (params?: GetMyQuotationsParams) => {
  return useQuery({
    queryKey: ["myQuotations", params],
    queryFn: () => getMyQuotationsService(params)
  });
};

export const useGetRequestQuotations = (requestId: string) => {
  return useQuery({
    queryKey: ["requestQuotations", requestId],
    queryFn: () => getRequestQuotationsService(requestId),
    enabled: Boolean(requestId)
  });
};

export const useAcceptQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quotationId: string) => acceptQuotationService(quotationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestQuotations"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    }
  });
};

export const useRejectQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quotationId, reason }: { quotationId: string; reason?: string }) =>
      rejectQuotationService(quotationId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestQuotations"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    }
  });
};

export const useCompareQuotationsWithAi = () => {
  return useMutation({
    mutationFn: ({ serviceRequestId, topN }: { serviceRequestId: string; topN?: number }) =>
      compareQuotationsWithAiService(serviceRequestId, topN)
  });
};
