import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { PaymentController } from "../../presentation/controller/payment.controller";
import { createCreatePaymentOrderUseCase, createVerifyPaymentUseCase } from "./useCases";

export function createPaymentController(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): PaymentController {
    const createPaymentOrderUseCase = createCreatePaymentOrderUseCase();
    const verifyPaymentUseCase = createVerifyPaymentUseCase(createNotificationUseCase);
    return new PaymentController(createPaymentOrderUseCase, verifyPaymentUseCase);
}
