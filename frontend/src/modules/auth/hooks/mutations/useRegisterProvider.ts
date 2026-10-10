import { useMutation } from "@tanstack/react-query";
import { registerProvider } from "../../services/auth.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../../store/auth/auth.store";

export const useRegisterProvider = () => {
    const login = useAuthStore((state) => state.login);
    
    return useMutation({
        mutationFn: registerProvider,
        onSuccess: (response) => {
            login(response.data.user, response.data.accessToken);
            toast.success("Provider registered successfully!");
        },
        onError: (error: ApiError) => {
            toast.error(error.message || "Failed to register provider.");
        }
    });
};
