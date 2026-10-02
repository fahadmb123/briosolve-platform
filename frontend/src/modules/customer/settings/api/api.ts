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
    const response = await apiClient.post("/api/customer/email-verify",data,{params: {work: "UPDATE"}})
    return response.data
}
