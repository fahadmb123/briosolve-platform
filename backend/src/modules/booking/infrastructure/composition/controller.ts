import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { CreditWalletInputDto } from "../../../wallet/application/dtos/request/credit-wallet.dto";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import { BookingController } from "../../presentation/controller/booking.controller";
import {
    createGetBookingByIdUseCase,
    createGetCustomerBookingsUseCase,
    createGetProviderBookingsUseCase,
    createUpdateBookingStatusUseCase
} from "./useCases";

export function createBookingController(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
): BookingController {
    const getBookingByIdUseCase = createGetBookingByIdUseCase();
    const getCustomerBookingsUseCase = createGetCustomerBookingsUseCase();
    const getProviderBookingsUseCase = createGetProviderBookingsUseCase();
    const updateBookingStatusUseCase = createUpdateBookingStatusUseCase(createNotificationUseCase, creditWalletUseCase);

    return new BookingController(
        getBookingByIdUseCase,
        getCustomerBookingsUseCase,
        getProviderBookingsUseCase,
        updateBookingStatusUseCase
    );
}
