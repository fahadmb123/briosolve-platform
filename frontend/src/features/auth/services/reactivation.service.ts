import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";

export type ReactivationRequestInput = {
    email: string;
    reason: string;
};

export type ReactivationRequestResponse = {
    id: string;
    user_id: string;
    block_id: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    created_at?: string;
    updated_at?: string;
};

export const submitReactivationRequest = async (data: ReactivationRequestInput): Promise<response<ReactivationRequestResponse>> => {
    const res = await apiClient.post("/api/reactivation/request", data);
    return res.data;
};

export const sendReactivationOtp = async (data: { email: string }): Promise<response<{ expiresIn: number }>> => {
    const res = await apiClient.post("/api/reactivation/send-otp", data);
    return res.data;
};
