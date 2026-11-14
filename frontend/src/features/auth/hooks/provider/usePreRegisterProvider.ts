import { useMutation } from "@tanstack/react-query";
import { preRegisterProvider } from "../../services/provider/providerRegistration.service";
import { toast } from 'react-hot-toast';

export const usePreRegisterProvider = () => {
    return useMutation({
        mutationFn: preRegisterProvider,
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        }
    });
};
