import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildPaymentRoute } from "../../presentation/routes/payment.routes";
import { createPaymentController } from "./controller";

export function createPaymentRoutes(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
) {
    const paymentController = createPaymentController(createNotificationUseCase);
    return buildPaymentRoute({
        payment: paymentController
    });
}

export * from "./services";
export * from "./useCases";
export * from "./controller";
