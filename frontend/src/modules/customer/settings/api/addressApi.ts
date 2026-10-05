import { apiClient } from "../../../../shared/api/Client"
import type { response } from "../../../../shared/types/Dtos"
import type { AddressPayload } from "../schemas/validation"



export const addAddress = async (data:AddressPayload): Promise<response<null>> => {
    const response = await apiClient.post("/api/auth/address",data)
    return response.data
}