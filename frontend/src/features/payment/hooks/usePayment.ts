import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentOrderService, verifyPaymentService } from "../services/payment.service";
import type { CreatePaymentOrderPayload, VerifyPaymentPayload } from "../types/payment.types";

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (payload: CreatePaymentOrderPayload) => createPaymentOrderService(payload)
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => verifyPaymentService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requestQuotations"] });
      queryClient.invalidateQueries({ queryKey: ["customerServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["serviceRequest"] });
    }
  });
};
