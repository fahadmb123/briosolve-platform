import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildPaymentRoute } from "../../presentation/routes/payment.routes";
import { createPaymentController } from "./controller";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";

export function createPaymentRoutes(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
) {
    const paymentController = createPaymentController(createNotificationUseCase, creditWalletUseCase);
    return buildPaymentRoute({
        payment: paymentController
    });
}

export * from "./services";
export * from "./useCases";
export * from "./controller";
