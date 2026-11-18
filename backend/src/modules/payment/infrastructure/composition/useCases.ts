import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { quotationRepository } from "../../../quotation-submission/infrastructure/composition/repositories";
import { serviceRequestRepository } from "../../../service-request/infrastructure/composition/repositories";
import { bookingRepository } from "../../../booking/infrastructure/composition/repositories";
import { razorpayService } from "./services";
import { CreatePaymentOrderUseCase } from "../../application/use-cases/createPaymentOrder.useCase";
import { VerifyPaymentUseCase } from "../../application/use-cases/verifyPayment.useCase";

export function createCreatePaymentOrderUseCase(): CreatePaymentOrderUseCase {
    return new CreatePaymentOrderUseCase(
        quotationRepository,
        serviceRequestRepository,
        razorpayService
    );
}

export function createVerifyPaymentUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): VerifyPaymentUseCase {
    return new VerifyPaymentUseCase(
        quotationRepository,
        serviceRequestRepository,
        bookingRepository,
        razorpayService,
        createNotificationUseCase
    );
}
