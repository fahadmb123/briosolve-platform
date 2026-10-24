import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "../../../shared/api/ApiError";
import { toast } from 'react-hot-toast';
import {
    createProviderAvailabilityOverride,
    deleteProviderAvailabilityOverride,
    getProviderAvailability,
    getProviderAvailabilityOverrides,
    setProviderAvailability
} from "../services/availability.service";
import * as SettingsService from "../../settings/services/providerSettings.service";

export const useGetProviderAvailability = () => {
    return useMutation({
        mutationFn: getProviderAvailability,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useSetProviderAvailability = () => {
    return useMutation({
        mutationFn: setProviderAvailability,
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

export const useGetProviderAvailabilityOverrides = () => {
    return useMutation({
        mutationFn: getProviderAvailabilityOverrides,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useCreateProviderAvailabilityOverride = () => {
    return useMutation({
        mutationFn: createProviderAvailabilityOverride,
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderAvailabilityOverride = () => {
    return useMutation({
        mutationFn: deleteProviderAvailabilityOverride,
        onError: (error: ApiError) => toast.error(error.message)
    });
};
