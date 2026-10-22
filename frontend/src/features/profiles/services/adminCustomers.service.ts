import { apiClient } from '../../../shared/api/Client';
import type { response, User } from '../types/profile.types';

export type GetCustomersInput = {
    page: number;
    limit: number;
    search: string;
    filter: string;
};

export const getCustomers = async (params: GetCustomersInput): Promise<response<{ users: User[]; total: number; totalPages: number }>> => {
    const res = await apiClient.get("/api/user/customers", { params });
    return res.data;
};

export const updateCustomerStatus = async (data: { id: string; status: string; reason?: string }): Promise<response<{ users: User[] }>> => {
    const res = await apiClient.patch(`/api/user/status/${data.id}`, data);
    return res.data;
};
