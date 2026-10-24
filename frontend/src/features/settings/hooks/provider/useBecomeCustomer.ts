import { useMutation } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import { becomeCustomer, sendBecomeCustomerOtp } from "../../services/becomeCustomer.service";

export const useSendBecomeCustomerOtp = () => {
    return useMutation({
        mutationFn: sendBecomeCustomerOtp,
        onSuccess: () => {
            toast.success("OTP sent to your email!");
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useBecomeCustomer = () => {
    return useMutation({
        mutationFn: becomeCustomer,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
