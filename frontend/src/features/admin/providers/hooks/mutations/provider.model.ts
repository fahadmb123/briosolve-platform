import { useMutation } from "@tanstack/react-query";
import { getProviders, updateStatus } from '../../services/providers.service';
import { toast } from "react-toastify";
import type { ApiError } from "../../../../../shared/api/ApiError";

export const useGetProviders = () => {
    return useMutation({
        mutationFn: getProviders,
        onError: (error: ApiError) => toast.error(error.message),
    });
};

export const useUpdateStatus = () => {
    return useMutation({
        mutationFn: updateStatus,
        onError: (error: ApiError) => toast.error(error.message),
    });
};
