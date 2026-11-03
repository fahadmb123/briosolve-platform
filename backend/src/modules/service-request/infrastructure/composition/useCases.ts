import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { addressRepository, userRepository } from "../../../user-management/infrastructure/composition/repositories";
import { imageUploadService } from "../../../user-management/infrastructure/composition/services";
import { CreateServiceRequestUseCase } from "../../application/use-cases/createServiceRequest.useCase";
import { serviceRequestRepository, serviceRequestProviderRepository } from "./respositories";
import { providerSelectionService } from "./services";

export function createServiceRequestUseCase (
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
): CreateServiceRequestUseCase {
    return new CreateServiceRequestUseCase(
        serviceRequestRepository,
        imageUploadService,
        createBulkNotificationUseCase,
        userRepository,
        addressRepository,
        providerSelectionService,
        serviceRequestProviderRepository
    );
}
