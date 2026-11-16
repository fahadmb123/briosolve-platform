import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { SubmitQuotationPayload } from "../types/quotation.types";

export const submitQuotationService = async (
  payload: SubmitQuotationPayload
): Promise<response<{ id: string; status: string }>> => {
  const res = await apiClient.post("/api/quotations", payload);
  return res.data;
};

export const getQuotationByRequestId = async (
  requestId: string
): Promise<response<any>> => {
  const res = await apiClient.get(`/api/service-requests/${requestId}/quotation`);
  return res.data;
};
