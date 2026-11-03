import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { addressRepository, userRepository } from "../../../user-management/infrastructure/composition/repositories";
import { CreateServiceRequestUseCase } from "../../application/use-cases/createServiceRequest.useCase";
import { GetCustomerServiceRequestsUseCase } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { CancelServiceRequestUseCase } from "../../application/use-cases/cancelServiceRequest.useCase";
import { UpdateServiceRequestUseCase } from "../../application/use-cases/updateServiceRequest.useCase";
import { serviceRequestRepository, serviceRequestProviderRepository } from "./repositories";
import { imageUploadService, providerSelectionService } from "./services";

export function createServiceRequestUseCase(
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

export const getCustomerServiceRequestsUseCase = new GetCustomerServiceRequestsUseCase(
    serviceRequestRepository
);

export const cancelServiceRequestUseCase = new CancelServiceRequestUseCase(
    serviceRequestRepository
);

export const updateServiceRequestUseCase = new UpdateServiceRequestUseCase(
    serviceRequestRepository,
    imageUploadService
);
