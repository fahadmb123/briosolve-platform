import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  CreateServiceRequestPayload,
  UpdateServiceRequestPayload,
  ServiceRequestItem,
  CustomerServiceRequestItem
} from "../types/serviceRequest.types";

export const createServiceRequest = async (data: CreateServiceRequestPayload): Promise<response<ServiceRequestItem>> => {
  const res = await apiClient.post("/api/service-request", data);
  return res.data;
};

export const getMyServiceRequests = async (): Promise<response<CustomerServiceRequestItem[]>> => {
  const res = await apiClient.get("/api/service-request");
  return res.data;
};

export const getProviderServiceRequests = async (): Promise<response<CustomerServiceRequestItem[]>> => {
  const res = await apiClient.get("/api/service-request/provider");
  return res.data;
};

export const updateServiceRequest = async (id: string, data: UpdateServiceRequestPayload): Promise<response<CustomerServiceRequestItem>> => {
  const res = await apiClient.put(`/api/service-request/${id}`, data);
  return res.data;
};

export const cancelServiceRequest = async (id: string): Promise<response<ServiceRequestItem>> => {
  const res = await apiClient.patch(`/api/service-request/${id}/cancel`);
  return res.data;
};
