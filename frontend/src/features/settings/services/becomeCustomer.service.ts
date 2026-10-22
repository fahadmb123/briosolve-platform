import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";

export const sendBecomeCustomerOtp = async (): Promise<response<{ expiresIn: number }>> => {
    const res = await apiClient.post("/api/provider/become-customer/send-otp");
    return res.data;
};

export const becomeCustomer = async (): Promise<response<null>> => {
    const res = await apiClient.post("/api/provider/become-customer");
    return res.data;
};
