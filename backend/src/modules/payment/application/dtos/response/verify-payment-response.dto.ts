export interface VerifyPaymentResponseDto {
    success: boolean;
    quotationId: string;
    serviceRequestId: string;
    paymentId: string;
    status: string;
    bookingId?: string;
    bookingNumber?: string;
}
