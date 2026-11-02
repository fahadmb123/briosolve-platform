import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type {
  CreateServiceRequestPayload,
  ServiceRequestItem
} from "../types/serviceRequest.types";

export const createServiceRequest = async (data: CreateServiceRequestPayload): Promise<response<ServiceRequestItem>> => {
  const res = await apiClient.post("/api/service-request", data)
  return res.data;
};

