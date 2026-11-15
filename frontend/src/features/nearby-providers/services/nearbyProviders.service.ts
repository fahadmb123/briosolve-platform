import { apiClient } from '../../../shared/api/Client';
import type { response, User } from '../../../shared/types/Dtos';

export type GetNearbyProvidersInput = {
    page?: number;
    limit?: number;
    search?: string;
    radius?: number;
};

export type NearbyProvidersResponseData = {
    users: User[];
    total: number;
    totalPages: number;
    customerRadius: number;
    hasCustomerLocation: boolean;
};

export type ProviderPublicProfileService = {
    id: string;
    service_id: string;
    service?: {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        category_id?: string;
        category?: {
            id: string;
            name: string;
            description?: string | null;
            image?: string | null;
        };
    };
};

export type ProviderPublicProfileAvailability = {
    id: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
};

export type ProviderPublicProfileData = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    status: string;
    distance?: number | null;
    current_address_id?: unknown;
    provider_profile?: {
        id: string;
        user_id: string;
        business_name: string;
        experience: string;
        bio: string;
        profile_image: string | null;
        service_radius_km?: number | null;
        completed_jobs: number;
        kyc_status: string;
        skills: string | null;
    } | null;
    services: ProviderPublicProfileService[];
    availability: ProviderPublicProfileAvailability[];
};

export const getNearbyProviders = async (params: GetNearbyProvidersInput = {}): Promise<response<NearbyProvidersResponseData>> => {
    const response = await apiClient.get("/api/customer/nearby-providers", { params });
    return response.data;
};

export const getProviderPublicProfile = async (providerId: string): Promise<response<ProviderPublicProfileData>> => {
    const response = await apiClient.get(`/api/customer/providers/${providerId}`);
    return response.data;
};
