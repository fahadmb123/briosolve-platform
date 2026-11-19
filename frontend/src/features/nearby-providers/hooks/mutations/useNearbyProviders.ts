import { useQuery } from "@tanstack/react-query";
import { getNearbyProviders, type GetNearbyProvidersInput } from "../../services/nearbyProviders.service";

export const useGetNearbyProviders = (params: GetNearbyProvidersInput = {}) => {
    return useQuery({
        queryKey: ["nearbyProviders", params],
        queryFn: () => getNearbyProviders(params),
    });
};
