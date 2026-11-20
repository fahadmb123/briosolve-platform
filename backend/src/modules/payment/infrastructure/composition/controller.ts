import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { PaymentController } from "../../presentation/controller/payment.controller";
import {
    createCreatePaymentOrderUseCase,
    createVerifyPaymentUseCase,
    createCreateBookingPaymentOrderUseCase,
    createVerifyBookingPaymentUseCase
} from "./useCases";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";

export function createPaymentController(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
): PaymentController {
    const createPaymentOrderUseCase = createCreatePaymentOrderUseCase();
    const verifyPaymentUseCase = createVerifyPaymentUseCase(createNotificationUseCase);
    const createBookingPaymentOrderUseCase = createCreateBookingPaymentOrderUseCase();
    const verifyBookingPaymentUseCase = createVerifyBookingPaymentUseCase(creditWalletUseCase, createNotificationUseCase);
    return new PaymentController(
        createPaymentOrderUseCase,
        verifyPaymentUseCase,
        createBookingPaymentOrderUseCase,
        verifyBookingPaymentUseCase
    );
}
