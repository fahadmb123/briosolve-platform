import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";
import type { BusinessProfileInputType } from "../schemas/validation";

export const updatePassword = async (data: { currentPassword: string; newPassword: string }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/auth/password", data);
    return response.data;
};

export const updateBusinessProfile = async (data: BusinessProfileInputType): Promise<response<null>> => {
    const response = await apiClient.patch("/api/provider/profile", data);
    return response.data;
};
