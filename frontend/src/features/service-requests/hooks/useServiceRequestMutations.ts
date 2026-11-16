import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getMyServiceRequests,
  getProviderServiceRequests,
  getAdminServiceRequests,
  updateServiceRequest,
  cancelServiceRequest,
  adminCancelServiceRequest,
  reopenServiceRequest,
  type ReopenServiceRequestPayload
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

export const useGetProviderServiceRequests = () => {
  return useMutation({
    mutationFn: getProviderServiceRequests
  });
};

export const useGetAdminServiceRequests = () => {
  return useMutation({
    mutationFn: getAdminServiceRequests
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

export const useAdminCancelServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminCancelServiceRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
    }
  });
};

export const useReopenServiceRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReopenServiceRequestPayload }) =>
      reopenServiceRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["adminServiceRequests"] });
      queryClient.invalidateQueries({ queryKey: ["providerServiceRequests"] });
    }
  });
};
