import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import { addProviderServices, deleteProviderCategory, deleteProviderService, getProviderServices } from "../services/tradeService.service";

export const useGetProviderServices = () => {
    return useQuery({
        queryKey: ["providerServices"],
        queryFn: getProviderServices,
    });
};

export const useAddProviderServices = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProviderServices,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerServices"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProviderService,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerServices"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderCategory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProviderCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerServices"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};
