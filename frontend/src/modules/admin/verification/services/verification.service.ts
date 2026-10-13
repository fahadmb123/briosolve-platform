import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";
import type {
  GetAdminVerificationsQuery,
  AdminVerificationsResponseData,
  UpdateKycStatusPayload,
} from "../types/verification.types";

export const getAdminVerificationsService = async (
  query: GetAdminVerificationsQuery
): Promise<response<AdminVerificationsResponseData>> => {
  const res = await apiClient.get("/api/verification/admin", { params: query });
  return res.data;
};

export const updateKycStatusService = async (
  payload: UpdateKycStatusPayload
): Promise<response<void>> => {
  const { providerId, ...body } = payload;
  const res = await apiClient.patch(`/api/verification/admin/${providerId}/status`, body);
  return res.data;
};
