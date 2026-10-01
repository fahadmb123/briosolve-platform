import { apiClient } from "../../../../shared/api/Client";
import type { response } from "../../../../shared/types/Dtos";





import type { NameInputType } from "../schemas/validation";

export const updateProfile = async (data: NameInputType): Promise<response<null>> => {
    const response = await apiClient.post("/api/customer/update-profile", data)
    return response.data
}
