import { useMutation } from "@tanstack/react-query";
import { registerProvider } from "../../services/provider/providerRegistration.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export const useRegisterProvider = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerProvider,
        onSuccess: async () => {
            toast.success("Provider registered successfully!");
            await useAuthStore.getState().fetchUser();
            navigate('/provider/kyc', { replace: true });
        },
        onError: (error: ApiError) => {
            toast.error(error.message || "Failed to register provider.");
        }
    });
};
