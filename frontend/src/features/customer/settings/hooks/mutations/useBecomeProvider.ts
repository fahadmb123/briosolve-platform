import { useMutation } from "@tanstack/react-query";
import { sendBecomeProviderOtp, becomeProvider } from "../../services/becomeProvider.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../../shared/api/ApiError";

export const useSendBecomeProviderOtp = () => {
    return useMutation({
        mutationFn: sendBecomeProviderOtp,
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useBecomeProvider = () => {
    return useMutation({
        mutationFn: becomeProvider,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
