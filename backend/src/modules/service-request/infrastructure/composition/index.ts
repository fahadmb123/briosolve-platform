import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildServiceRequestRoute } from "../../presentation/routes/serviceRequest.routes";
import { createServiceRequestController } from "./controller";

export function createServiceRequestRoutes(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>,
    createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
) {
    const serviceRequestController = createServiceRequestController(
        createBulkNotificationUseCase,
        createNotificationUseCase
    );

    return buildServiceRequestRoute({
        serviceRequest: serviceRequestController
    });
}

export * from "./repositories";
export * from "./services";
export * from "./useCases";
export * from "./controller";
