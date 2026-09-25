import { apiClient } from "../../../shared/api/Client";

type RegisterCustomerInput = {
    name:string,
    email:string,
    password:string
}

export const registerCustomer = async (data:RegisterCustomerInput): Promise<RegisterCustomerInput> => {
    const response = await apiClient.post(
        "/api/auth/register",
        data
    )
    return response.data;
}