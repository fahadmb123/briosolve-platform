import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../../quotation-submission/domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IRazorpayService } from "../../domain/services/IRazorpayService";
import { VerifyPaymentInputDto } from "../dtos/request/verify-payment.dto";
import { VerifyPaymentResponseDto } from "../dtos/response/verify-payment-response.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { db } from "../../../../shared/database/client";

export class VerifyPaymentUseCase implements IUseCase<VerifyPaymentInputDto, VerifyPaymentResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _razorpayService: IRazorpayService,
        private readonly _createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
    ) {}

    async execute(input: VerifyPaymentInputDto): Promise<VerifyPaymentResponseDto> {
        const isValid = this._razorpayService.verifySignature(
            input.razorpayOrderId,
            input.razorpayPaymentId,
            input.razorpaySignature
        );

        if (!isValid) {
            throw new ApplicationError("INVALID_SIGNATURE", "Payment verification failed. Invalid signature", "VALIDATION");
        }

        const quotation = await this._quotationRepository.findById(input.quotationId);
        if (!quotation) {
            throw new ApplicationError("QUOTATION_NOT_FOUND", "Quotation not found", "NOT_FOUND");
        }

        const serviceRequest = await this._serviceRequestRepository.findById(quotation.service_request_id);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized for this payment", "AUTHENTICATION");
        }

        await this._quotationRepository.update(quotation.id, {
            status: "ACCEPTED"
        });

        const allQuotes = await this._quotationRepository.findByServiceRequestId(quotation.service_request_id);
        const otherQuotes = allQuotes.filter((q) => q.id !== quotation.id && q.status === "PENDING");

        for (const other of otherQuotes) {
            await this._quotationRepository.update(other.id, {
                status: "REJECTED"
            });
        }

        await this._serviceRequestRepository.updateStatus(serviceRequest.id, "ACCEPTED");

        if (this._createNotificationUseCase) {
            const providerProfile = await db.orm.public.provider_profiles
                .where({ id: quotation.provider_id as never })
                .first();

            if (providerProfile) {
                await this._createNotificationUseCase.execute({
                    recipientId: providerProfile.user_id,
                    type: "PAYMENT_CONFIRMED",
                    title: "Booking & Payment Confirmed!",
                    title_code: "PAYMENT_CONFIRMED",
                    message: `Customer payment of ₹${quotation.amount} is safely secured in escrow. Your quote for "${serviceRequest.title}" is accepted.`
                }).catch(() => null);
            }

            await this._createNotificationUseCase.execute({
                recipientId: input.customerId,
                type: "BOOKING_CONFIRMED",
                title: "Booking Confirmed!",
                title_code: "BOOKING_CONFIRMED",
                message: `Payment successful. Your booking for "${serviceRequest.title}" is confirmed with 15-day service warranty.`
            }).catch(() => null);

            for (const other of otherQuotes) {
                const otherProfile = await db.orm.public.provider_profiles
                    .where({ id: other.provider_id as never })
                    .first();

                if (otherProfile) {
                    await this._createNotificationUseCase.execute({
                        recipientId: otherProfile.user_id,
                        type: "QUOTATION_REJECTED",
                        title: "Quotation Update",
                        title_code: "QUOTATION_REJECTED",
                        message: `Another quotation was accepted for "${serviceRequest.title}". Thank you for your submission.`
                    }).catch(() => null);
                }
            }
        }

        return {
            success: true,
            quotationId: quotation.id,
            serviceRequestId: serviceRequest.id,
            paymentId: input.razorpayPaymentId,
            status: "ACCEPTED"
        };
    }
}
