import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";

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
        }
    }
}


export const updateTravelBuffer = async (data: { travel_buffer_minutes: number }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
}

export const updateAcceptingLeads = async (data: { accepting_leads: boolean }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
}

