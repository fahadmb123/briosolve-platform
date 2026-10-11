import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";

export const updatePassword = async (data: { currentPassword: string; newPassword: string }): Promise<response<null>> => {
    const response = await apiClient.patch("/api/auth/password", data);
    return response.data;
};
