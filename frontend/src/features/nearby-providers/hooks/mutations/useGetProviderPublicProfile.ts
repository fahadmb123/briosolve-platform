import { useQuery } from "@tanstack/react-query";
import { getProviderPublicProfile } from "../../services/nearbyProviders.service";

export const useGetProviderPublicProfile = (providerId?: string) => {
    return useQuery({
        queryKey: ["providerPublicProfile", providerId],
        queryFn: () => (providerId ? getProviderPublicProfile(providerId) : Promise.reject("No providerId")),
        enabled: Boolean(providerId),
    });
};
