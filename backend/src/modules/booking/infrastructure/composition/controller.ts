import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { BookingController } from "../../presentation/controller/booking.controller";
import {
    createGetBookingByIdUseCase,
    createGetCustomerBookingsUseCase,
    createGetProviderBookingsUseCase,
    createUpdateBookingStatusUseCase
} from "./useCases";

export function createBookingController(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): BookingController {
    const getBookingByIdUseCase = createGetBookingByIdUseCase();
    const getCustomerBookingsUseCase = createGetCustomerBookingsUseCase();
    const getProviderBookingsUseCase = createGetProviderBookingsUseCase();
    const updateBookingStatusUseCase = createUpdateBookingStatusUseCase(createNotificationUseCase);

    return new BookingController(
        getBookingByIdUseCase,
        getCustomerBookingsUseCase,
        getProviderBookingsUseCase,
        updateBookingStatusUseCase
    );
}
