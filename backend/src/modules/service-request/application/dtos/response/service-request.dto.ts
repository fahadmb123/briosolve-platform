import { ServiceRequestImage } from "../../../domain/entities/serviceRequest.entity";

export interface ServiceRequestResponseDto {
    id: string;
    customer_id: string;
    category_id: string;
    subservice_id: string | null;
    title: string;
    description: string;
    urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
    specific_date: Date | null;
    address_id: string;
    available_time_from: string;
    available_time_to: string;
    budget_type: "OPEN_BID" | "FIXED";
    budget_amount: number | null;
    status: "PENDING" | "ACTIVE" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "EXPIRED";
    created_at: Date;
    updated_at: Date;
    images?: ServiceRequestImage[];
}

export interface ServiceRequestAddressDto {
    id: string;
    house_no?: string | null;
    area: string;
    city: string;
    district?: string | null;
    state: string;
    pincode: string;
    landmark?: string | null;
    latitude?: number | null;
    longitude?: number | null;
}

export interface ServiceRequestCustomerDto {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    profile_image?: string | null;
}

export interface ServiceRequestDetailsDto extends ServiceRequestResponseDto {
    category_name?: string;
    subservice_name?: string | null;
    address_details?: ServiceRequestAddressDto | null;
    customer_details?: ServiceRequestCustomerDto | null;
    distance_km?: number | null;
    matched_providers_count?: number;
    quotations_count?: number;
}

export interface GetCustomerRequestsOutputDto {
    requests: ServiceRequestDetailsDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    counts: Record<string, number>;
}

export interface GetProviderRequestsOutputDto {
    requests: ServiceRequestDetailsDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
}

export interface GetAdminServiceRequestsInputDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: "NEWEST" | "OLDEST";
}

export interface GetAdminRequestsOutputDto {
    requests: ServiceRequestDetailsDto[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
    counts: Record<string, number>;
}
