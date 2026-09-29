import { useMutation } from "@tanstack/react-query";
import { registerCustomer } from "../../api/api";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../../shared/api/ApiError";

export const useRegisterCustomer = () => {
    return useMutation({
        mutationFn: registerCustomer,
        onError: (error: ApiError) => toast.error(error.message),
    });
};