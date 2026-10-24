import { useMutation } from "@tanstack/react-query";
import { submitReactivationRequest, sendReactivationOtp } from "../services/reactivation.service";
import { toast } from 'react-hot-toast';


export const useAccountReactivation = () => {
    return useMutation({
        mutationFn: submitReactivationRequest
    });
};

export const useSendReactivationOtp = () => {
    return useMutation({
        mutationFn: sendReactivationOtp,
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        }
    });
};
