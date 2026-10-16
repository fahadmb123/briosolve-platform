import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { VerificationDocument } from "../types/kyc.types";

export const getProviderVerifications = async () => {
    const res = await apiClient.get<response<VerificationDocument[]>>("/api/verification");
    return res.data;
};

export const uploadVerificationDocument = async (data: FormData) => {
    const res = await apiClient.post<response<VerificationDocument>>("/api/verification", data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const updateVerificationDocument = async ({ id, data }: { id: string; data: FormData }) => {
    const res = await apiClient.patch<response<VerificationDocument>>(`/api/verification/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
};

export const deleteVerificationDocument = async (id: string) => {
    const res = await apiClient.delete<response<null>>(`/api/verification/${id}`);
    return res.data;
};
