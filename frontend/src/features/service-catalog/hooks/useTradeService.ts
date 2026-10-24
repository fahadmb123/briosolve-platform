import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import { addProviderServices, deleteProviderCategory, deleteProviderService, getProviderServices } from "../services/tradeService.service";

export const useGetProviderServices = () => {
    return useMutation({
        mutationFn: getProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useAddProviderServices = () => {
    return useMutation({
        mutationFn: addProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderService = () => {
    return useMutation({
        mutationFn: deleteProviderService,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderCategory = () => {
    return useMutation({
        mutationFn: deleteProviderCategory,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
