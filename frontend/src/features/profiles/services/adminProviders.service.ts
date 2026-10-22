import { apiClient } from '../../../shared/api/Client';
import type { response, User } from '../types/profile.types';

export type GetProvidersInput = {
    page: number;
    limit: number;
    search: string;
    filter: string;
};

export const getProviders = async (params: GetProvidersInput): Promise<response<{ users: User[]; total: number; totalPages: number }>> => {
    const res = await apiClient.get("/api/user/providers", { params });
    return res.data;
};

export const updateProviderStatus = async (data: { id: string; status: string; reason?: string }): Promise<response<{ users: User[] }>> => {
    const res = await apiClient.patch(`/api/user/status/${data.id}`, data);
    return res.data;
};
