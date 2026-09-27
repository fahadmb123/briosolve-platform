import { apiClient } from "../../../shared/api/Client";
import type { response, User } from "../../../shared/Dtos";




export const getCustomers = async (): Promise<response<{users:User[]}>> => {
    const response = await apiClient.get("/api/user/get-users")
    return response.data;
}
