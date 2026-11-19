import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProviders, updateProviderStatus, type GetProvidersInput } from "../../services/adminProviders.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import type { response, User } from "../../types/profile.types";

export const useGetProviders = (params: GetProvidersInput) => {
    return useQuery({
        queryKey: ["adminProviders", params],
        queryFn: () => getProviders(params),
    });
};

export const useUpdateProviderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation<response<{ users: User[] }>, ApiError, { id: string; status: string; reason?: string }>({
        mutationFn: updateProviderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProviders"] });
        },
        onError: (error: ApiError) => toast.error(error.message),
    });
};
