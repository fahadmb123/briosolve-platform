import { apiClient } from "../../../../shared/api/Client"
import type { Address } from "../../../../shared/Dtos/address"
import type { response } from "../../../../shared/types/Dtos"
import type { AddressPayload } from "../schemas/validation"



type getAddressesInput = {
    page:number,
    limit:number;
    search:string;
}

export const addAddress = async (data:AddressPayload): Promise<response<Address>> => {
    const response = await apiClient.post("/api/user/address",data)
    return response.data
}
export const getAddresses = async (params:getAddressesInput): Promise<response<{addresses:Address[],total:number,totalPages:number}>> => {
    const response = await apiClient.get("/api/user/address",{params})
    return response.data
}
