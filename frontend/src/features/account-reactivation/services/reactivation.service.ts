import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { ReactivationRequestItem } from "../types/reactivation.types";

export interface GetReactivationsQuery {
  page: number;
  limit: number;
  search?: string;
  filter?: string;
  role?: string;
  sort?: "asc" | "desc";
}

export interface ReactivationsResponseData {
  requests: ReactivationRequestItem[];
  total: number;
  totalPages: number;
}

export const getReactivationsService = async (
  query: GetReactivationsQuery
): Promise<response<ReactivationsResponseData>> => {
  const res = await apiClient.get("/api/reactivation", { params: query });
  return res.data;
};
