import { apiClient } from "../../../../shared/api/Client";
import type { CustomerProfile, response, User } from "../../../../shared/types/Dtos";





import type { NameInputType } from "../schemas/validation";

export const updateProfile = async (data: NameInputType): Promise<response<null>> => {
    const response = await apiClient.patch("/api/customer/profile", data)
    return response.data
}

export const getProfile = async (): Promise<response<{user:User,profile:CustomerProfile}>> => {
    const response = await apiClient.get("/api/user/profile")
    return response.data
}
