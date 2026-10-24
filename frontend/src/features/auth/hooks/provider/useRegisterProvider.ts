import { useMutation } from "@tanstack/react-query";
import { registerProvider } from "../../services/provider/providerRegistration.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import { useNavigate } from "react-router-dom";

export const useRegisterProvider = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerProvider,
        onSuccess: () => {
            toast.success("Provider registered successfully. Please login.");
            navigate('/login');
        },
        onError: (error: ApiError) => {
            toast.error(error.message || "Failed to register provider.");
        }
    });
};
