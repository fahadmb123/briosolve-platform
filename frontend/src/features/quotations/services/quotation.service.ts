import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  SubmitQuotationPayload,
  UpdateQuotationPayload,
  GetMyQuotationsParams,
  GetMyQuotationsResponse,
  RequestQuotationsResponse,
  CompareQuotationsResponse
} from "../types/quotation.types";

export const submitQuotationService = async (
  payload: SubmitQuotationPayload
): Promise<response<{ id: string; status: string }>> => {
  const res = await apiClient.post("/api/quotation", payload);
  return res.data;
};

export const updateQuotationService = async (
  id: string,
  payload: Omit<UpdateQuotationPayload, "id">
): Promise<response<{ id: string; status: string }>> => {
  const res = await apiClient.put(`/api/quotation/${id}`, payload);
  return res.data;
};

export const getQuotationByRequestId = async (
  requestId: string
): Promise<response<any>> => {
  const res = await apiClient.get(`/api/quotation/request/${requestId}`);
  return res.data;
};

export const getRequestQuotationsService = async (
  requestId: string
): Promise<response<RequestQuotationsResponse>> => {
  const res = await apiClient.get(`/api/quotation/request/${requestId}`);
  return res.data;
};

export const acceptQuotationService = async (
  quotationId: string
): Promise<response<{ id: string; status: string; serviceRequestId: string }>> => {
  const res = await apiClient.patch(`/api/quotation/${quotationId}/accept`);
  return res.data;
};

export const rejectQuotationService = async (
  quotationId: string,
  reason?: string
): Promise<response<{ id: string; status: string }>> => {
  const res = await apiClient.patch(`/api/quotation/${quotationId}/reject`, { reason });
  return res.data;
};

export const getMyQuotationsService = async (
  params?: GetMyQuotationsParams
): Promise<response<GetMyQuotationsResponse>> => {
  const res = await apiClient.get("/api/quotation/my", { params });
  return res.data;
};

export const compareQuotationsWithAiService = async (
  serviceRequestId: string,
  topN?: number
): Promise<response<CompareQuotationsResponse>> => {
  const res = await apiClient.post("/api/ai/quotations/compare", {
    serviceRequestId,
    topN
  });
  return res.data;
};
