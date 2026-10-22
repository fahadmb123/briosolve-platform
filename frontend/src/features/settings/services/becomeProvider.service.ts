import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";

export type BecomeProviderInput = {
    businessName: string;
    experience: string;
    bio: string;
    services: string[];
};

export const sendBecomeProviderOtp = async (): Promise<response<{ expiresIn: number }>> => {
    const res = await apiClient.post("/api/customer/become-provider/send-otp");
    return res.data;
};

export const becomeProvider = async (data: BecomeProviderInput): Promise<response<null>> => {
    const res = await apiClient.post("/api/customer/become-provider", data);
    return res.data;
};
