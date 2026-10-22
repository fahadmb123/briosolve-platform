import { apiClient } from "../../../shared/api/Client";
import type { response } from "../../../shared/types/Dtos";
import type { BusinessProfileInputType } from "../schemas/providerSettings.schema";

export const updatePassword = async (data: { currentPassword: string; newPassword: string }): Promise<response<null>> => {
    const res = await apiClient.patch("/api/auth/password", data);
    return res.data;
};

export const updateBusinessProfile = async (data: Partial<BusinessProfileInputType> & { service_radius_km?: number }): Promise<response<null>> => {
    const res = await apiClient.patch("/api/provider/profile", data);
    return res.data;
};
