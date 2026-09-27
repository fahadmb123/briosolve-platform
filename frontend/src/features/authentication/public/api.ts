import { apiClient } from "../../../shared/api/Client";
import type { LoginInputType } from "./validation";
import type { response } from "../../../shared/Dtos";

type OtpVarifyInput = {
    otp:string
}
type OtpVarifyOutput = {
    success:boolean,
    message:string,
}
type OtpStatusOut = {
    success: boolean,
    data: {
        attempts: number,
        expiresIn: number
    }
}




export const otpVarify = async (data:OtpVarifyInput): Promise<OtpVarifyOutput> => {
    const response = await apiClient.post(
        "/api/auth/otp-varify",
        data
    )
    return response.data;
}
export const getOtpStatus = async (): Promise<OtpStatusOut> => {
    const response = await apiClient.get(
        "/api/auth/otp-status"
    )
    return response.data;
}



export const resendOtp = async (): Promise<response<{expiresIn: number}>> => {
    const response = await apiClient.post("/api/auth/resend-otp")
    return response.data;
}

export const login = async (data:LoginInputType): Promise<response<string>> => {
    const response = await apiClient.post("/api/auth/login",data)
    return response.data;
}
export const getMe = async (): Promise<response<string>> => {
    const response = await apiClient.get("/api/auth/me")
    return response.data;
}
