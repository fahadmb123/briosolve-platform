export interface ProviderServiceRaw {
    id: string;
    provider_id: string;
    service_id: string;
    created_at: Date | { epochMilliseconds: number } | string;
    service?: unknown;
}

export interface AddProviderServicesInputDto {
    userId: string;
    serviceIds: string[];
}

export interface DeleteProviderServiceInputDto {
    userId: string;
    serviceId: string;
}
