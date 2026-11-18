export interface GetBookingByIdInputDto {
    bookingId: string;
    userId: string;
}

export interface GetCustomerBookingsInputDto {
    customerId: string;
}

export interface GetProviderBookingsInputDto {
    providerId: string;
}
