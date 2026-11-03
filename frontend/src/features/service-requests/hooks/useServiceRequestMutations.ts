import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getMyServiceRequests,
  updateServiceRequest,
  cancelServiceRequest
} from "../services/serviceRequest.service";
import type { UpdateServiceRequestPayload } from "../types/serviceRequest.types";

export const useCreateServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
    }
  });
};

export const useGetMyServiceRequests = () => {
  return useMutation({
    mutationFn: getMyServiceRequests
  });
};

export const useUpdateServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequestPayload }) =>
      updateServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
    }
  });
};

export const useCancelServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
    }
  });
};
