import { useMutation } from "@tanstack/react-query";
import { emailVerify, getMe, getOtpStatus, login, logout, otpVarify, resendOtp, resetPassword } from "../../services/auth.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../shared/api/ApiError";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../store/auth/auth.store";

import { useResetFlowStore } from "../../../../store/auth/reset-flow.store";

export const useOtpVarify = (isInline?: boolean) => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: otpVarify,
        onSuccess: async (response) => {
            if (response.data.path === "reset-password") {
                useResetFlowStore.getState().setOtpVerified(true);
            }
            
            if (response.data.path === "settings") {
                useResetFlowStore.getState().setOtpFlowStarted(false);
                let currentUser = useAuthStore.getState().user;
                if (!currentUser) {
                    try {
                        await useAuthStore.getState().fetchUser();
                        currentUser = useAuthStore.getState().user;
                    } catch (e) {
                        console.error(e);
                    }
                }

                if (currentUser) {
                    useAuthStore.getState().setUser({
                        ...currentUser,
                        ...(response.data.email ? { email: response.data.email, email_verified: true } : {}),
                        ...(response.data.phone ? { phone: response.data.phone, phone_verified: true } : {})
                    });
                    useAuthStore.getState().fetchUser();
                }

                if (!isInline) {
                    if (currentUser?.role === "PROVIDER") {
                        navigate("/provider/settings", { replace: true, state: { activeSection: 'account' } });
                    } else if (currentUser?.role === "ADMIN") {
                        navigate("/admin/settings", { replace: true });
                    } else {
                        navigate(`/${response.data.path}`, { replace: true, state: { activeView: 'contact' } });
                    }
                }
            } else {
                if (!isInline && response?.data.path) navigate(`/${response.data.path}`);
            }

            if (response.data.path === "login" || response.data.path === "settings") {
                toast.success(response.message);
            }
        },
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
    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            const user = response.data.user;
            useAuthStore.getState().setUser(user);
            useAuthStore.getState().setProfile(user.customer_profile || user.provider_profile || null);
            
            if (user.role === "CUSTOMER") {
                navigate("/", { replace: true });
            } else {
                navigate(`/${user.role.toLocaleLowerCase()}`, { replace: true });
            }
            toast.success(response.message);
        },
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
    const navigate = useNavigate();

    return useMutation({
        mutationFn: emailVerify,
        onSuccess: (response) => {
            useResetFlowStore.getState().setResetFlowStarted(true);
            useResetFlowStore.getState().setOtpFlowStarted(true);
            navigate("/otp-verification", { replace: true });
            toast.success(response.message);
        },
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useResetPassword = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (response) => {
            useResetFlowStore.getState().clearResetFlow();
            navigate("/login", { replace: true });
            toast.success(response.message);
        },
        onError: (error: ApiError) => toast.error(error.message),
    });
};