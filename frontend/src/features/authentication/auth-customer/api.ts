import { apiClient } from "../../../shared/api/Client";

type RegisterCustomerInput = {
    name:string,
    email:string,
    password:string
}

type RegisterCustomerOutput<T> = {
    success:boolean,
    message:string,
    data:T
}

export const registerCustomer = async (data:RegisterCustomerInput): Promise<RegisterCustomerOutput<{expiresIn:number}>> => {
    const response = await apiClient.post(
        "/api/auth/register",
        data
    )
    return response.data;
}