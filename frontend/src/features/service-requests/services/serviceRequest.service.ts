import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  CreateServiceRequestPayload,
  UpdateServiceRequestPayload,
  ServiceRequestItem,
  CustomerServiceRequestItem
} from "../types/serviceRequest.types";

export interface GetCustomerRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: "NEWEST" | "OLDEST";
}

export interface GetCustomerRequestsResponse {
  requests: CustomerServiceRequestItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  counts: Record<string, number>;
}

export interface GetProviderRequestsParams {
  page?: number;
  limit?: number;
  search?: string;
  urgency?: string;
  budgetType?: string;
  sortBy?: "NEWEST" | "URGENT" | "BUDGET_HIGH";
}

export interface GetProviderRequestsResponse {
  requests: CustomerServiceRequestItem[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

export const createServiceRequest = async (data: CreateServiceRequestPayload): Promise<response<ServiceRequestItem>> => {
  const res = await apiClient.post("/api/service-request", data);
  return res.data;
};

export const getMyServiceRequests = async (
  params?: GetCustomerRequestsParams
): Promise<response<GetCustomerRequestsResponse>> => {
  const res = await apiClient.get("/api/service-request", { params });
  return res.data;
};

export const getProviderServiceRequests = async (
  params?: GetProviderRequestsParams
): Promise<response<GetProviderRequestsResponse>> => {
  const res = await apiClient.get("/api/service-request/provider", { params });
  return res.data;
};

export const getAdminServiceRequests = async (
  params?: GetCustomerRequestsParams
): Promise<response<GetCustomerRequestsResponse>> => {
  const res = await apiClient.get("/api/service-request/admin", { params });
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

export const adminCancelServiceRequest = async (id: string): Promise<response<void>> => {
  const res = await apiClient.patch(`/api/service-request/${id}/admin-cancel`);
  return res.data;
};
