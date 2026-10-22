import { apiClient } from "../../../shared/api/Client";
import type { Address } from "../types/address";
import type { response } from "../../../shared/types/Dtos";
import type { AddressPayload } from "../schemas/address.schema";

export type getAddressesInput = {
    page: number;
    limit: number;
    search: string;
};

export const getAddresses = async (params: getAddressesInput): Promise<response<{ addresses: Address[]; total: number; totalPages: number }>> => {
    const response = await apiClient.get("/api/user/address", { params });
    return response.data;
};

export const addAddress = async (data: AddressPayload): Promise<response<Address>> => {
    const response = await apiClient.post("/api/user/address", data);
    return response.data;
};

export const editAddress = async ({ id, data }: { id: string; data: AddressPayload }): Promise<response<Address>> => {
    const response = await apiClient.patch(`/api/user/address/${id}`, data);
    return response.data;
};

export const setDefaultAddress = async (id: string): Promise<response<null>> => {
    const response = await apiClient.patch(`/api/user/address/default/${id}`);
    return response.data;
};

export const deleteAddress = async (id: string): Promise<response<null>> => {
    const response = await apiClient.delete(`/api/user/address/${id}`);
    return response.data;
};
