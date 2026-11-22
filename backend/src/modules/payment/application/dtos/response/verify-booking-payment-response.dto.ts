export interface VerifyBookingPaymentResponseDto {
    success: boolean;
    bookingId: string;
    status: string;
    paymentStatus: string;
}
