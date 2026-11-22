export interface VerifyBookingPaymentInputDto {
    bookingId: string;
    customerId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
