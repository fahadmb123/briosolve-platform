export interface CreatePaymentOrderResponseDto {
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
