import { apiClient } from '../../../../shared/api/Client';
import type { response, User } from '../../../../shared/types/Dtos';



type getCustomersInput = {
    page:number,
    limit:number;
    search:string;
    filter:string
}


export const getCustomers = async (params:getCustomersInput): Promise<response<{users:User[],total:number,totalPages:number}>> => {
    const response = await apiClient.get("/api/customer/customers",{params})
    return response.data;
}


export const updateStatus = async (data:{id:string,status:string}): Promise<response<{users:User[]}>> => {
    const response = await apiClient.patch(`/api/user/status/${data.id}`,data)
    return response.data;
}
