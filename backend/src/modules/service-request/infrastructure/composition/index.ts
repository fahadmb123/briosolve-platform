import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildServiceRequestRoute } from "../../presentation/routes/serviceRequest.routes";
import { createServiceRequestController } from "./controller";

export function createServiceRequestRoutes(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
) {
    const serviceRequestController = createServiceRequestController(createBulkNotificationUseCase);

    return buildServiceRequestRoute({
        serviceRequest: serviceRequestController
    });
}

export * from "./repositories";
export * from "./services";
export * from "./useCases";
export * from "./controller";
