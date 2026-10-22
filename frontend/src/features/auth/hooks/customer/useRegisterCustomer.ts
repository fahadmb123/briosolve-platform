import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "../../services/customer/customerRegistration.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../shared/api/ApiError";

export const useRegisterCustomer = () => {
    return useMutation({
        mutationFn: registerCustomer,
        onError: (error: ApiError) => toast.error(error.message),
    });
};