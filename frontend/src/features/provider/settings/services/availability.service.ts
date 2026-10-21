import { apiClient } from "../../../../shared/api/Client";
import type { CreateAvailabilityOverridePayload, ProviderAvailabilityItem, ProviderAvailabilityOverrideItem, response, SetAvailabilitySlotPayload } from "../../../../shared/types/Dtos";



export const getProviderAvailabilityOverrides = async (): Promise<response<ProviderAvailabilityOverrideItem[]>> => {
    const response = await apiClient.get("/api/provider/availability/overrides");
    return response.data;
};

export const createProviderAvailabilityOverride = async (data: CreateAvailabilityOverridePayload): Promise<response<ProviderAvailabilityOverrideItem>> => {
    const response = await apiClient.post("/api/provider/availability/overrides", data);
    return response.data;
};

export const deleteProviderAvailabilityOverride = async (id: string): Promise<response<null>> => {
    const response = await apiClient.delete(`/api/provider/availability/overrides/${id}`);
    return response.data;
};

export const getProviderAvailability = async (): Promise<response<ProviderAvailabilityItem[]>> => {
    const response = await apiClient.get("/api/provider/availability");
    return response.data;
};

export const setProviderAvailability = async (slots: SetAvailabilitySlotPayload[]): Promise<response<ProviderAvailabilityItem[]>> => {
    const response = await apiClient.put("/api/provider/availability", { slots });
    return response.data;
};
