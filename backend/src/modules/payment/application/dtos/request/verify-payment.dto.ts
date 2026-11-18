export interface VerifyPaymentInputDto {
    quotationId: string;
    customerId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
