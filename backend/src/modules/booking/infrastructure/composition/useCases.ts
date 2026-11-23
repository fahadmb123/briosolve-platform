import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import type { CreditWalletInputDto } from "../../../wallet/application/use-cases/creditWallet.useCase";
import { WalletResponseDto } from "../../../wallet/application/dtos/response/wallet-response.dto";
import { bookingRepository } from "./repositories";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories";
import { serviceRequestRepository } from "../../../service-request/infrastructure/composition/repositories";
import { quotationRepository } from "../../../quotation-submission/infrastructure/composition/repositories";
import { CreateBookingUseCase } from "../../application/use-cases/createBooking.useCase";
import { GetBookingByIdUseCase } from "../../application/use-cases/getBookingById.useCase";
import { GetCustomerBookingsUseCase } from "../../application/use-cases/getCustomerBookings.useCase";
import { GetProviderBookingsUseCase } from "../../application/use-cases/getProviderBookings.useCase";
import { GetAdminBookingsUseCase } from "../../application/use-cases/getAdminBookings.useCase";
import { AdminUpdateBookingStatusUseCase } from "../../application/use-cases/adminUpdateBookingStatus.useCase";
import { UpdateBookingStatusUseCase } from "../../application/use-cases/updateBookingStatus.useCase";
import { ReportServiceMismatchUseCase } from "../../application/use-cases/reportServiceMismatch.useCase";
import { ResolveServiceMismatchUseCase } from "../../application/use-cases/resolveServiceMismatch.useCase";
import { SubmitWarrantyClaimUseCase } from "../../application/use-cases/submitWarrantyClaim.useCase";
import { ResolveWarrantyClaimUseCase } from "../../application/use-cases/resolveWarrantyClaim.useCase";

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

export function createGetAdminBookingsUseCase(): GetAdminBookingsUseCase {
    return new GetAdminBookingsUseCase(bookingRepository);
}

export function createAdminUpdateBookingStatusUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>
): AdminUpdateBookingStatusUseCase {
    return new AdminUpdateBookingStatusUseCase(
        bookingRepository,
        providerRepository,
        serviceRequestRepository,
        quotationRepository,
        createNotificationUseCase,
        creditWalletUseCase
    );
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

export function createReportServiceMismatchUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): ReportServiceMismatchUseCase {
    return new ReportServiceMismatchUseCase(
        bookingRepository,
        providerRepository,
        createNotificationUseCase
    );
}

export function createResolveServiceMismatchUseCase(
    creditWalletUseCase?: IUseCase<CreditWalletInputDto, WalletResponseDto>,
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): ResolveServiceMismatchUseCase {
    return new ResolveServiceMismatchUseCase(
        bookingRepository,
        providerRepository,
        serviceRequestRepository,
        creditWalletUseCase,
        createNotificationUseCase
    );
}

export function createSubmitWarrantyClaimUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): SubmitWarrantyClaimUseCase {
    return new SubmitWarrantyClaimUseCase(
        bookingRepository,
        providerRepository,
        createNotificationUseCase
    );
}

export function createResolveWarrantyClaimUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): ResolveWarrantyClaimUseCase {
    return new ResolveWarrantyClaimUseCase(
        bookingRepository,
        providerRepository,
        createNotificationUseCase
    );
}
