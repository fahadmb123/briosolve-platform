import { useMutation } from "@tanstack/react-query";
import { getNearbyProviders } from "../../services/nearbyProviders.service";
import { toast } from "react-toastify";
import type { ApiError } from "../../../../../shared/api/ApiError";

export const useGetNearbyProviders = () => {
    return useMutation({
        mutationFn: getNearbyProviders,
        onError: (error: ApiError) => toast.error(error.message || 'Failed to load providers'),
    });
};
