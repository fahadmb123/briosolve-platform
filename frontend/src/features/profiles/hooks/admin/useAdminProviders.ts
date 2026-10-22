import { useMutation } from "@tanstack/react-query";
import { getProviders, updateProviderStatus } from "../../services/adminProviders.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../shared/api/ApiError";
import type { response, User } from "../../types/profile.types";

export const useGetProviders = () => {
    return useMutation({
        mutationFn: getProviders,
        onError: (error: ApiError) => toast.error(error.message),
    });
};

export const useUpdateProviderStatus = () => {
    return useMutation<response<{ users: User[] }>, ApiError, { id: string; status: string; reason?: string }>({
        mutationFn: updateProviderStatus,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
