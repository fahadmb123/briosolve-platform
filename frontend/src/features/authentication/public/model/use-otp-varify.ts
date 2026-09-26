import { useMutation } from "@tanstack/react-query";
import { getOtpStatus, otpVarify, resendOtp } from "../api";




export const useOtpVarify = () => {
    return useMutation({
        mutationFn:otpVarify ,
    })
}
export const useGetOtpStatus = () => {
    return useMutation({
        mutationFn:getOtpStatus ,
    })
}
export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
    })
}