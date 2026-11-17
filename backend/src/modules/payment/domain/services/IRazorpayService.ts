export interface CreateOrderParams {
    amountInPaise: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
}

export interface IRazorpayService {
    createOrder(params: CreateOrderParams): Promise<{ id: string; amount: number; currency: string }>;
    verifySignature(orderId: string, paymentId: string, signature: string): boolean;
    getKeyId(): string;
}
