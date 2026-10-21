export type UpdateProviderProfileInputDataDto = {
    name?: string;
    businessName?: string;
    business_name?: string;
    experience?: string;
    bio?: string;
    profile_image?: string | null;
    service_radius_km?: number | null;
    accepting_leads?: boolean;
    travel_buffer_minutes?: number;
}

export type UpdateProviderProfileInputDto = {
    id: string;
    data: UpdateProviderProfileInputDataDto;
};