export interface CreatePaymentOrderPayload {
  quotationId: string;
}

export interface CreatePaymentOrderResponse {
  orderId: string;
  amount: number;
  baseAmount: number;
  platformFee: number;
  currency: string;
  keyId: string;
  quotationId: string;
  serviceRequestId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface VerifyPaymentPayload {
  quotationId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  quotationId: string;
  serviceRequestId: string;
  paymentId: string;
  status: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
