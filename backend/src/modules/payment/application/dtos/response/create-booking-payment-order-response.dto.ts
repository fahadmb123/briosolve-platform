export interface CreateBookingPaymentOrderResponseDto {
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    bookingId: string;
}
