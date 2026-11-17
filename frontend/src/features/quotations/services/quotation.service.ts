import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { SubmitQuotationPayload, GetMyQuotationsParams, GetMyQuotationsResponse } from "../types/quotation.types";

export const submitQuotationService = async (
  payload: SubmitQuotationPayload
): Promise<response<{ id: string; status: string }>> => {
  const res = await apiClient.post("/api/quotation", payload);
  return res.data;
};

export const getQuotationByRequestId = async (
  requestId: string
): Promise<response<any>> => {
  const res = await apiClient.get(`/api/service-request/${requestId}/quotation`);
  return res.data;
};

export const getMyQuotationsService = async (
  params?: GetMyQuotationsParams
): Promise<response<GetMyQuotationsResponse>> => {
  const res = await apiClient.get("/api/quotation/my", { params });
  return res.data;
};
