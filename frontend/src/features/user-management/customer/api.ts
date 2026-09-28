import { apiClient } from "../../../shared/api/Client";
import type { response, User } from "../../../shared/Dtos";



type getCustomersInput = {
    page:number,
    limit:number;
    search:string;
    filter:string
}


export const getCustomers = async (params:getCustomersInput): Promise<response<{users:User[],total:number,totalPages:number}>> => {
    const response = await apiClient.get("/api/user/get-users",{params})
    return response.data;
}


export const updateStatus = async (data:{id:string,status:string}): Promise<response<{users:User[]}>> => {
    const response = await apiClient.post("/api/user/update-status",data)
    return response.data;
}
