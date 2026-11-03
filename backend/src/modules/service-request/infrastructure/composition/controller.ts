import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { ServiceRequestController } from "../../presentation/controller/serviceRequest.controller";
import {
    createServiceRequestUseCase,
    getCustomerServiceRequestsUseCase,
    createCancelServiceRequestUseCase,
    updateServiceRequestUseCase,
    getProviderServiceRequestsUseCase
} from "./useCases";

export function createServiceRequestController(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>,
    createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): ServiceRequestController {
    const serviceRequestUseCase = createServiceRequestUseCase(createBulkNotificationUseCase);
    const cancelServiceRequestUseCase = createCancelServiceRequestUseCase(createNotificationUseCase);

    return new ServiceRequestController(
        serviceRequestUseCase,
        getCustomerServiceRequestsUseCase,
        cancelServiceRequestUseCase,
        updateServiceRequestUseCase,
        getProviderServiceRequestsUseCase
    );
}
