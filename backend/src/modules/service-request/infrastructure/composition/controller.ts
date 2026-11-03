import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { ServiceRequestController } from "../../presentation/controller/serviceRequest.controller";
import {
    createServiceRequestUseCase,
    getCustomerServiceRequestsUseCase,
    cancelServiceRequestUseCase
} from "./useCases";

export function createServiceRequestController(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
): ServiceRequestController {
    const serviceRequestUseCase = createServiceRequestUseCase(createBulkNotificationUseCase);

    return new ServiceRequestController(
        serviceRequestUseCase,
        getCustomerServiceRequestsUseCase,
        cancelServiceRequestUseCase
    );
}
