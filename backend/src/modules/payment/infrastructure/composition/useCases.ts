import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { quotationRepository } from "../../../quotation-submission/infrastructure/composition/repositories";
import { serviceRequestRepository } from "../../../service-request/infrastructure/composition/repositories";
import { bookingRepository } from "../../../booking/infrastructure/composition/repositories";
import { userRepository, providerRepository } from "../../../user-management/infrastructure/composition/repositories";
import { razorpayService } from "./services";
import { CreatePaymentOrderUseCase } from "../../application/use-cases/createPaymentOrder.useCase";
import { VerifyPaymentUseCase } from "../../application/use-cases/verifyPayment.useCase";
import { CreateBookingPaymentOrderUseCase } from "../../application/use-cases/createBookingPaymentOrder.useCase";
import { VerifyBookingPaymentUseCase } from "../../application/use-cases/verifyBookingPayment.useCase";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";

export function createCreatePaymentOrderUseCase(): CreatePaymentOrderUseCase {
    return new CreatePaymentOrderUseCase(
        quotationRepository,
        serviceRequestRepository,
        userRepository,
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
        providerRepository,
        razorpayService,
        createNotificationUseCase
    );
}

export function createCreateBookingPaymentOrderUseCase(): CreateBookingPaymentOrderUseCase {
    return new CreateBookingPaymentOrderUseCase(
        bookingRepository,
        razorpayService
    );
}

export function createVerifyBookingPaymentUseCase(
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>,
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): VerifyBookingPaymentUseCase {
    return new VerifyBookingPaymentUseCase(
        bookingRepository,
        serviceRequestRepository,
        providerRepository,
        razorpayService,
        creditWalletUseCase,
        createNotificationUseCase
    );
}
