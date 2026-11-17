import { BaseController } from "../../../../shared/base/controller/baseController";
import type { NextFunction, Request, Response } from "express";
import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreatePaymentOrderInputDto } from "../../application/dtos/request/create-payment-order.dto";
import { CreatePaymentOrderResponseDto } from "../../application/dtos/response/create-payment-order-response.dto";
import { VerifyPaymentInputDto } from "../../application/dtos/request/verify-payment.dto";
import { VerifyPaymentResponseDto } from "../../application/dtos/response/verify-payment-response.dto";

export class PaymentController extends BaseController {
    constructor(
        private readonly _createPaymentOrderUseCase: IUseCase<CreatePaymentOrderInputDto, CreatePaymentOrderResponseDto>,
        private readonly _verifyPaymentUseCase: IUseCase<VerifyPaymentInputDto, VerifyPaymentResponseDto>
    ) {
        super();
    }

    createOrder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            const quotationId = req.body?.quotationId;

            const response = await this._createPaymentOrderUseCase.execute({
                quotationId,
                customerId: customerId!
            });

            return this.sendSuccess(res, "Payment order created", response, 201);
        } catch (error) {
            next(error);
        }
    };

    verifyAndAccept = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customerId = req.user?.userId;
            const { quotationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

            const response = await this._verifyPaymentUseCase.execute({
                quotationId,
                customerId: customerId!,
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
            });

            return this.sendSuccess(res, "Payment verified and quotation accepted", response, 200);
        } catch (error) {
            next(error);
        }
    };
}
