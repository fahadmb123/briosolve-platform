import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createServiceRequest,
  getMyServiceRequests,
  getProviderServiceRequests,
  getAdminServiceRequests,
  updateServiceRequest,
  cancelServiceRequest,
  adminCancelServiceRequest,
  reopenServiceRequest,
  type ReopenServiceRequestPayload,
  type GetCustomerRequestsParams,
  type GetProviderRequestsParams
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

export const useGetMyServiceRequests = (params?: GetCustomerRequestsParams) => {
  return useQuery({
    queryKey: ["myServiceRequests", params],
    queryFn: () => getMyServiceRequests(params)
  });
};

export const useGetProviderServiceRequests = (params?: GetProviderRequestsParams) => {
  return useQuery({
    queryKey: ["providerServiceRequests", params],
    queryFn: () => getProviderServiceRequests(params)
  });
};

export const useGetAdminServiceRequests = (params?: GetCustomerRequestsParams) => {
  return useQuery({
    queryKey: ["adminServiceRequests", params],
    queryFn: () => getAdminServiceRequests(params)
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
    }
  });
};
