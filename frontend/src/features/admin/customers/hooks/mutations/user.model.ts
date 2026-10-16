import { useMutation } from "@tanstack/react-query";
import { getCustomers, updateStatus } from '../../services/customers.service';
import { toast } from "react-toastify";
import type { ApiError } from "../../../../../shared/api/ApiError";

export const useGetCustomers = () => {
    return useMutation({
        mutationFn: getCustomers,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
export const useUpdateStatus = () => {
    return useMutation({
        mutationFn: updateStatus,
        onError: (error: ApiError) => toast.error(error.message),
    });
};