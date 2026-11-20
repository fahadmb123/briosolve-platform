import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IBookingRepository } from "../../../booking/domain/repositories/IBookingRepository";
import { IRazorpayService } from "../../domain/services/IRazorpayService";
import { CreateBookingPaymentOrderInputDto } from "../dtos/request/create-booking-payment-order.dto";
import { CreateBookingPaymentOrderResponseDto } from "../dtos/response/create-booking-payment-order-response.dto";

export class CreateBookingPaymentOrderUseCase implements IUseCase<CreateBookingPaymentOrderInputDto, CreateBookingPaymentOrderResponseDto> {
    constructor(
        private readonly _bookingRepository: IBookingRepository,
        private readonly _razorpayService: IRazorpayService
    ) {}

    async execute(input: CreateBookingPaymentOrderInputDto): Promise<CreateBookingPaymentOrderResponseDto> {
        const details = await this._bookingRepository.findDetailsById(input.bookingId);
        if (!details) {
            throw new ApplicationError("BOOKING_NOT_FOUND", "Booking not found", "NOT_FOUND");
        }

        if (details.booking.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to make payment for this booking", "AUTHENTICATION");
        }

        if (details.booking.status !== "PAYMENT_PENDING") {
            throw new ApplicationError("INVALID_STATE", `Cannot pay balance for booking with status ${details.booking.status}`, "VALIDATION");
        }

        const isFixed = details.quotationType === "FIXED";
        const advanceAmount = isFixed
            ? Number(details.booking.total_amount || 0)
            : (details.quoteAmount
                ? Math.round(Number(details.quoteAmount) * 1.1)
                : (details.booking.advance_amount && details.booking.advance_amount > 0
                    ? Number(details.booking.advance_amount)
                    : Number(details.booking.total_amount || 0)));

        const totalAmount = Number(details.booking.total_amount || 0);
        const remainingAmount = Math.max(0, totalAmount - advanceAmount);

        if (remainingAmount <= 0) {
            throw new ApplicationError("INVALID_AMOUNT", "No remaining balance due for this booking", "VALIDATION");
        }

        const amountInPaise = Math.round(remainingAmount * 100);

        const order = await this._razorpayService.createOrder({
            amountInPaise,
            currency: "INR",
            receipt: `rcpt_bk_${details.booking.id.slice(0, 8)}_${Date.now().toString().slice(-4)}`,
            notes: {
                bookingId: details.booking.id,
                customerId: input.customerId,
                remainingAmount: String(remainingAmount),
                totalAmount: String(totalAmount)
            }
        });

        const keyId = this._razorpayService.getKeyId();

        return {
            orderId: order.id,
            amount: remainingAmount,
            currency: "INR",
            keyId,
            bookingId: details.booking.id
        };
    }
}
