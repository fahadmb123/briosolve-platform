import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    return useQuery({
        queryKey: ["providerAvailability"],
        queryFn: getProviderAvailability,
    });
};

export const useSetProviderAvailability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setProviderAvailability,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerAvailability"] });
        },
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
    return useQuery({
        queryKey: ["providerAvailabilityOverrides"],
        queryFn: getProviderAvailabilityOverrides,
    });
};

export const useCreateProviderAvailabilityOverride = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createProviderAvailabilityOverride,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerAvailabilityOverrides"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};

export const useDeleteProviderAvailabilityOverride = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProviderAvailabilityOverride,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["providerAvailabilityOverrides"] });
        },
        onError: (error: ApiError) => toast.error(error.message)
    });
};
