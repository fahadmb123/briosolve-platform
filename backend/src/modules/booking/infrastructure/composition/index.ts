import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import { buildBookingRoute } from "../../presentation/routes/booking.routes";
import { createBookingController } from "./controller";

export function createBookingRoutes(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
) {
    const bookingController = createBookingController(createNotificationUseCase, creditWalletUseCase);
    return buildBookingRoute({
        booking: bookingController
    });
}

export * from "./repositories";
export * from "./useCases";
export * from "./controller";
