import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCustomers, updateCustomerStatus, type GetCustomersInput } from "../../services/adminCustomers.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import type { response, User } from "../../types/profile.types";

export const useGetCustomers = (params: GetCustomersInput) => {
    return useQuery({
        queryKey: ["adminCustomers", params],
        queryFn: () => getCustomers(params),
    });
};

export const useUpdateCustomerStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<response<{ users: User[] }>, ApiError, { id: string; status: string; reason?: string }>({
        mutationFn: updateCustomerStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminCustomers"] });
        },
        onError: (error: ApiError) => toast.error(error.message),
    });
};
