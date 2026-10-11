import { useMutation } from "@tanstack/react-query";
import * as SettingsService from "../../services/settings.service";
import type { ApiError } from "../../../../../shared/api/ApiError";
import { toast } from "react-toastify";

export const useGetProviderAvailability = () => {
    return useMutation({
        mutationFn: SettingsService.getProviderAvailability,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useSetProviderAvailability = () => {
    return useMutation({
        mutationFn: SettingsService.setProviderAvailability,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUpdateTravelBuffer = () => {
    return useMutation({
        mutationFn: SettingsService.updateTravelBuffer,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useUpdateAcceptingLeads = () => {
    return useMutation({
        mutationFn: SettingsService.updateAcceptingLeads,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
