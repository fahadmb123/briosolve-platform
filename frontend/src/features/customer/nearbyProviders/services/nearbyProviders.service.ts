import { apiClient } from '../../../../shared/api/Client';
import type { response, User } from '../../../../shared/types/Dtos';

export type GetNearbyProvidersInput = {
    page?: number;
    limit?: number;
    search?: string;
    radius?: number;
};

export type NearbyProvidersResponseData = {
    users: User[];
    total: number;
    totalPages: number;
    customerRadius: number;
    hasCustomerLocation: boolean;
};

export const getNearbyProviders = async (params: GetNearbyProvidersInput = {}): Promise<response<NearbyProvidersResponseData>> => {
    const response = await apiClient.get("/api/customer/nearby-providers", { params });
    return response.data;
};
