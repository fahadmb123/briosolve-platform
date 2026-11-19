import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../shared/api/ApiError";
import {
  getAdminVerificationsService,
  updateKycStatusService,
} from "../services/adminVerification.service";
import type {
  GetAdminVerificationsQuery,
  UpdateKycStatusPayload,
} from "../types/adminVerification.types";

export const useGetAdminVerifications = (query: GetAdminVerificationsQuery) => {
  return useQuery({
    queryKey: ["adminVerifications", query],
    queryFn: () => getAdminVerificationsService(query),
  });
};

export const useUpdateKycStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateKycStatusPayload) =>
      updateKycStatusService(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVerifications"] });
    },
    onError: (error: ApiError) => toast.error(error.message),
  });
};
