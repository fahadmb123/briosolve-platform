import { apiClient } from "../../../shared/api/Client";

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

type ResendOtpOutput = {
    success: boolean,
    message: string,
    data: {
        expiresIn: number
    }
}

export const resendOtp = async (): Promise<ResendOtpOutput> => {
    const response = await apiClient.post("/api/auth/resend-otp")
    return response.data;
}