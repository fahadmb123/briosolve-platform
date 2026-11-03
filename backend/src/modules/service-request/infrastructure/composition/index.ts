import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { buildServiceRequestRoute } from "../../presentation/routes/serviceRequest.routes";
import { createServiceRequestController } from "./controller";

export function createServiceRequestRoutes(
    createBulkNotificationUseCase:IUseCase<CreateBulkNotificationRequestDto,NotificationResponseDto[]>
){
    return buildServiceRequestRoute({
        serviceRequest: createServiceRequestController(createBulkNotificationUseCase)
    })
}