import { useMutation } from "@tanstack/react-query";
import { getProviderPublicProfile, type ProviderPublicProfileData } from "../../services/nearbyProviders.service";
import { toast } from 'react-hot-toast';
import type { ApiError } from "../../../../shared/api/ApiError";
import type { response } from "../../../../shared/types/Dtos";

export const useGetProviderPublicProfile = () => {
    return useMutation<response<ProviderPublicProfileData>, ApiError, string>({
        mutationFn: (providerId: string) => getProviderPublicProfile(providerId),
        onError: (error: ApiError) => toast.error(error.message || 'Failed to load provider profile'),
    });
};

