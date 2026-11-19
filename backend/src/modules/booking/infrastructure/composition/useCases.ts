import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { CreditWalletInputDto } from "../../../wallet/application/use-cases/creditWallet.useCase";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import { bookingRepository } from "./repositories";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories";
import { serviceRequestRepository } from "../../../service-request/infrastructure/composition/repositories";
import { quotationRepository } from "../../../quotation-submission/infrastructure/composition/repositories";
import { CreateBookingUseCase } from "../../application/use-cases/createBooking.useCase";
import { GetBookingByIdUseCase } from "../../application/use-cases/getBookingById.useCase";
import { GetCustomerBookingsUseCase } from "../../application/use-cases/getCustomerBookings.useCase";
import { GetProviderBookingsUseCase } from "../../application/use-cases/getProviderBookings.useCase";
import { UpdateBookingStatusUseCase } from "../../application/use-cases/updateBookingStatus.useCase";

export function createCreateBookingUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): CreateBookingUseCase {
    return new CreateBookingUseCase(bookingRepository, providerRepository, createNotificationUseCase);
}

export function createGetBookingByIdUseCase(): GetBookingByIdUseCase {
    return new GetBookingByIdUseCase(bookingRepository, providerRepository);
}

export function createGetCustomerBookingsUseCase(): GetCustomerBookingsUseCase {
    return new GetCustomerBookingsUseCase(bookingRepository);
}

export function createGetProviderBookingsUseCase(): GetProviderBookingsUseCase {
    return new GetProviderBookingsUseCase(bookingRepository, providerRepository);
}

export function createUpdateBookingStatusUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
): UpdateBookingStatusUseCase {
    return new UpdateBookingStatusUseCase(
        bookingRepository,
        providerRepository,
        serviceRequestRepository,
        quotationRepository,
        createNotificationUseCase,
        creditWalletUseCase
    );
}
