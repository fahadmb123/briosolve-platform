import { useMutation } from "@tanstack/react-query";
import { getCustomers, updateCustomerStatus } from "../../services/adminCustomers.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import type { response, User } from "../../types/profile.types";

export const useGetCustomers = () => {
    return useMutation({
        mutationFn: getCustomers,
        onError: (error: ApiError) => toast.error(error.message),
    });
};

export const useUpdateCustomerStatus = () => {
    return useMutation<response<{ users: User[] }>, ApiError, { id: string; status: string; reason?: string }>({
        mutationFn: updateCustomerStatus,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
