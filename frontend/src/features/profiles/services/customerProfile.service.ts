import { apiClient } from "../../../shared/api/Client";
import type { CustomerProfile, response, User } from "../types/profile.types";
import type { NameInputType } from "../schemas/customerProfile.schema";

export const updateProfile = async (data: NameInputType): Promise<response<null>> => {
    const res = await apiClient.patch("/api/customer/profile", data);
    return res.data;
};

export const getProfile = async (): Promise<response<{ user: User; profile: CustomerProfile }>> => {
    const res = await apiClient.get("/api/user/profile");
    return res.data;
};
