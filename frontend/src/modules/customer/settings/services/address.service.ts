import { apiClient } from "../../../../shared/api/Client"
import type { Address } from "../../../../shared/Dtos/address"
import type { response } from "../../../../shared/types/Dtos"
import type { AddressPayload } from "../schemas/validation"



export const addAddress = async (data:AddressPayload): Promise<response<null>> => {
    const response = await apiClient.post("/api/user/address",data)
    return response.data
}
export const getAddresses = async (): Promise<response<{addresses:Address[]}>> => {
    const response = await apiClient.get("/api/user/address")
    return response.data
}