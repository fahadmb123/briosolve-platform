import { useMutation } from "@tanstack/react-query";
import { preRegisterProvider } from "../services/providerRegistration.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../shared/api/ApiError";

export const usePreRegisterProvider = () => {
    return useMutation({
        mutationFn: preRegisterProvider,
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        },
        onError: (error: ApiError) => {
            toast.error(error.message || "Failed to send OTP.");
        }
    });
};
