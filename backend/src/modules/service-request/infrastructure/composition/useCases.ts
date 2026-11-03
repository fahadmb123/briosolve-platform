import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { imageUploadService } from "../../../user-management/infrastructure/composition/services";
import { CreateServiceRequestUseCase } from "../../application/use-cases/createServiceRequest.useCase";
import { serviceRequestRepository } from "./respositories";

export function createServiceRequestUseCase (
    createBulkNotificationUseCase:IUseCase<CreateBulkNotificationRequestDto,NotificationResponseDto[]>
) :CreateServiceRequestUseCase{
    return new CreateServiceRequestUseCase(
        serviceRequestRepository,
        imageUploadService,
        createBulkNotificationUseCase
    )
}
