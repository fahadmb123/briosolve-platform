import { useMutation } from "@tanstack/react-query";
import { emailVerify, getMe, getOtpStatus, login, logout, otpVarify, resendOtp, resetPassword } from "../../api/api";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../shared/api/ApiError";

export const useOtpVarify = () => {
    return useMutation({
        mutationFn: otpVarify,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useGetOtpStatus = () => {
    return useMutation({
        mutationFn: getOtpStatus,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useLogin = () => {
    return useMutation({
        mutationFn: login,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useGetMe = () => {
    return useMutation({
        mutationFn: getMe,
    });
};
export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
    });
};
export const useEmailVerify = () => {
    return useMutation({
        mutationFn: emailVerify,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useResetPassword = () => {
    return useMutation({
        mutationFn: resetPassword,
        onError: (error: ApiError) => toast.error(error.message),
    });
};