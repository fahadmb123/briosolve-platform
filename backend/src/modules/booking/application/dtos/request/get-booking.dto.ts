export interface GetBookingByIdInputDto {
    bookingId: string;
    userId: string;
}

export interface GetCustomerBookingsInputDto {
    customerId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export interface GetProviderBookingsInputDto {
    providerId: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}
