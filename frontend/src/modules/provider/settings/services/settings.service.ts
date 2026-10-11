import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";
import type { BusinessProfileInputType } from "../schemas/validation";

export interface PopulatedProviderService {
    id: string;
    provider_id: string;
    service_id: string;
    created_at: string;
    service?: {
        id: string;
        category_id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        created_at: string;
        updated_at: string;
        category?: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            created_at: string;
            updated_at: string;
        };
    };
}

export const updatePassword = async (data: { currentPassword: string; newPassword: string }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/auth/password", data);
    return response.data;
};

export const updateBusinessProfile = async (data: Partial<BusinessProfileInputType> & { service_radius_km?: number }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
};

export const updateServiceRadius = async (data: { service_radius_km: number }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
};

export const getProviderServices = async (): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.get("/api/provider/service");
    return response.data;
};

export const addProviderServices = async (serviceIds: string[]): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.post("/api/provider/service", { serviceIds });
    return response.data;
};

export const deleteProviderService = async (id: string): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.delete(`/api/provider/service/${id}`);
    return response.data;
};

export const deleteProviderCategory = async (categoryId: string): Promise<response<PopulatedProviderService[]>> => {
    const response = await apiClient.delete(`/api/provider/service/category/${categoryId}`);
    return response.data;
};


