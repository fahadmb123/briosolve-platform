import { useMutation } from "@tanstack/react-query";
import { emailVerify, getMe, getOtpStatus, login, logout, otpVarify, resendOtp, resetPassword } from "../../api/api";




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
export const useGetMe = () => {
    return useMutation({
        mutationFn: getMe,
    })
}
export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
    })
}
export const useEmailVerify = () => {
    return useMutation({
        mutationFn: emailVerify,
    })
}
export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
    })
}