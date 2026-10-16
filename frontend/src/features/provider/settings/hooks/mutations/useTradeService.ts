import { useMutation } from "@tanstack/react-query";
import * as SettingsService from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useGetProviderServices = () => {
    return useMutation({
        mutationFn: SettingsService.getProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useAddProviderServices = () => {
    return useMutation({
        mutationFn: SettingsService.addProviderServices,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderService = () => {
    return useMutation({
        mutationFn: SettingsService.deleteProviderService,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderCategory = () => {
    return useMutation({
        mutationFn: SettingsService.deleteProviderCategory,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
