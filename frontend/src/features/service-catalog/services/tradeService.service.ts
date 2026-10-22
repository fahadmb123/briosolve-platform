import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { PopulatedProviderService } from "../../settings";




export const getProviderServices = async (): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.get("/api/provider/service");
    return response.data;
}

export const addProviderServices = async (serviceIds: string[]): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.post("/api/provider/service", { serviceIds });
    return response.data;
}

export const updateServiceRadius = async (data: { service_radius_km: number }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
}

export const deleteProviderService = async (id: string): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.delete(`/api/provider/service/${id}`);
    return response.data;
}

export const deleteProviderCategory = async (categoryId: string): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.delete(`/api/provider/service/category/${categoryId}`);
    return response.data;
}
