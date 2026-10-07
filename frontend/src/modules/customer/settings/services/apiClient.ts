import { apiClient } from "../../../../shared/api/Client"
import type { response } from "../../../../shared/types/Dtos"

export type OtpVarifyOutput = {
    success:boolean,
    message:string,
    data:{
        path:string
    }
}



export const updateEmail = async (data:{email:string}): Promise<response<OtpVarifyOutput>> => {
    const response = await apiClient.patch("/api/auth/email",data,{params: {work: "UPDATE"}})
    return response.data
}

export const updatePassword = async (data:{currentPassword:string,newPassword:string}): Promise<response<null>> => {
    const response = await apiClient.patch("/api/auth/password",data)
    return response.data
}
export const updatePhone = async (data:{phone:string}): Promise<response<null>> => {
    const response = await apiClient.patch("/api/auth/phone",data,{params:{path:"settings"}})
    return response.data
}

export const deletePhone = async (): Promise<response<null>> => {
    const response = await apiClient.delete("/api/auth/phone")
    return response.data
}
