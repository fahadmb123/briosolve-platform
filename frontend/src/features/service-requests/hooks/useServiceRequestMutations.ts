import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getMyServiceRequests,
  cancelServiceRequest
} from "../services/serviceRequest.service";

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

export const useCancelServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
    }
  });
};

