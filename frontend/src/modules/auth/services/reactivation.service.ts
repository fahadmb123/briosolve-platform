import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";

export type ReactivationRequestInput = {
    email: string;
    reason: string;
};

export const submitReactivationRequest = async (data: ReactivationRequestInput): Promise<response<any>> => {
    const res = await apiClient.post("/api/user/reactivation-request", data);
    return res.data;
};
