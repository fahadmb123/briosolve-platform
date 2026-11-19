import { CreatePaymentOrderResponseDto } from "../../application/dtos/response/create-payment-order-response.dto";
import { VerifyPaymentResponseDto } from "../../application/dtos/response/verify-payment-response.dto";

export class PaymentMapper {
    static toCreatePaymentOrderResponseDto(
        order: { id: string; currency: string },
        amounts: { totalAmount: number; baseAmount: number; platformFee: number },
        keyId: string,
        quotationId: string,
        serviceRequestId: string,
        customerUser?: { name?: string | null; email?: string | null; phone?: string | null } | null
    ): CreatePaymentOrderResponseDto {
        return {
            orderId: order.id,
            amount: amounts.totalAmount,
            baseAmount: amounts.baseAmount,
            platformFee: amounts.platformFee,
            currency: order.currency,
            keyId,
            quotationId,
            serviceRequestId,
            customerName: customerUser?.name ?? "Customer",
            customerEmail: customerUser?.email ?? "",
            customerPhone: customerUser?.phone ?? ""
        };
    }

    static toVerifyPaymentResponseDto(
        quotationId: string,
        serviceRequestId: string,
        paymentId: string,
        status: string,
        bookingId?: string,
        bookingNumber?: string
    ): VerifyPaymentResponseDto {
        return {
            success: true,
            quotationId,
            serviceRequestId,
            paymentId,
            status,
            bookingId,
            bookingNumber
        };
    }
}
