import { useMutation } from "@tanstack/react-query";
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

export const useGetAdminVerifications = () => {
  return useMutation({
    mutationFn: (query: GetAdminVerificationsQuery) =>
      getAdminVerificationsService(query),
    onError: (error: ApiError) => toast.error(error.message),
  });
};

export const useUpdateKycStatus = () => {
  return useMutation({
    mutationFn: (payload: UpdateKycStatusPayload) =>
      updateKycStatusService(payload),
    onError: (error: ApiError) => toast.error(error.message),
  });
};
