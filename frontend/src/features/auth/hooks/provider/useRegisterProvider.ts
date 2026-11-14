import { useMutation } from "@tanstack/react-query";
import { registerProvider } from "../../services/provider/providerRegistration.service";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export const useRegisterProvider = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: registerProvider,
        onSuccess: (response) => {
            toast.success(response.message || "Provider registered successfully! Please sign in.");
            navigate('/login', { replace: true });
        }
    });
};
