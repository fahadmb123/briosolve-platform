import { useMutation } from "@tanstack/react-query";
import { getOtpStatus, login, otpVarify, resendOtp } from "../api";




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
export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    })
}