import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/errors/applicationError";
import { IQuotationRepository } from "../../../quotation-submission/domain/repositories/IQuotationRepository";
import { IServiceRequestRepository } from "../../../service-request/domain/repositories/IServiceRequestRepository";
import { IUserRepository } from "../../../user-management/domain/repositories/IUserRepository";
import { IRazorpayService } from "../../domain/services/IRazorpayService";
import { CreatePaymentOrderInputDto } from "../dtos/request/create-payment-order.dto";
import { CreatePaymentOrderResponseDto } from "../dtos/response/create-payment-order-response.dto";
import { PaymentMapper } from "../mappers/payment.mapper";

export class CreatePaymentOrderUseCase implements IUseCase<CreatePaymentOrderInputDto, CreatePaymentOrderResponseDto> {
    constructor(
        private readonly _quotationRepository: IQuotationRepository,
        private readonly _serviceRequestRepository: IServiceRequestRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _razorpayService: IRazorpayService
    ) {}

    async execute(input: CreatePaymentOrderInputDto): Promise<CreatePaymentOrderResponseDto> {
        const quotation = await this._quotationRepository.findById(input.quotationId);
        if (!quotation) {
            throw new ApplicationError("QUOTATION_NOT_FOUND", "Quotation not found", "NOT_FOUND");
        }

        if (quotation.status !== "PENDING") {
            throw new ApplicationError("INVALID_STATE", `Quotation is currently ${quotation.status.toLowerCase()}`, "VALIDATION");
        }

        if (quotation.valid_until_date && new Date().getTime() > new Date(quotation.valid_until_date).getTime()) {
            await this._quotationRepository.update(quotation.id, {
                status: "EXPIRED",
                rejectionReason: "Quotation validity expired"
            });
            throw new ApplicationError("QUOTATION_EXPIRED", "This quotation has expired and can no longer be accepted", "VALIDATION");
        }

        const serviceRequest = await this._serviceRequestRepository.findById(quotation.service_request_id);
        if (!serviceRequest) {
            throw new ApplicationError("REQUEST_NOT_FOUND", "Service request not found", "NOT_FOUND");
        }

        if (serviceRequest.customer_id !== input.customerId) {
            throw new ApplicationError("FORBIDDEN", "You are not authorized to make payment for this request", "AUTHENTICATION");
        }

        if (serviceRequest.status === "CANCELLED" || serviceRequest.status === "EXPIRED" || serviceRequest.status === "COMPLETED") {
            throw new ApplicationError("INVALID_STATE", `Cannot pay for a ${serviceRequest.status.toLowerCase()} service request`, "VALIDATION");
        }

        const baseAmount = Number(quotation.amount);
        const platformFee = Math.round(baseAmount * 0.05);
        const totalAmount = baseAmount + platformFee;
        const amountInPaise = Math.round(totalAmount * 100);

        const customerUser = await this._userRepository.findById(input.customerId);

        const order = await this._razorpayService.createOrder({
            amountInPaise,
            currency: "INR",
            receipt: `rcpt_${quotation.id.slice(0, 8)}_${Date.now().toString().slice(-4)}`,
            notes: {
                quotationId: quotation.id,
                serviceRequestId: serviceRequest.id,
                customerId: input.customerId,
                baseAmount: String(baseAmount),
                platformFee: String(platformFee)
            }
        });

        const keyId = this._razorpayService.getKeyId();

        return PaymentMapper.toCreatePaymentOrderResponseDto(
            order,
            { totalAmount, baseAmount, platformFee },
            keyId,
            quotation.id,
            serviceRequest.id,
            customerUser
        );
    }
}
