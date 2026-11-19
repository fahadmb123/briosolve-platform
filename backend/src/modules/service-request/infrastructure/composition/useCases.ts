import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateBulkNotificationRequestDto } from "../../../notification/application/dtos/request/create-bulk-notifications.dto";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { addressRepository, userRepository, providerRepository } from "../../../user-management/infrastructure/composition/repositories";
import { quotationRepository } from "../../../quotation-submission/infrastructure/composition/repositories";
import { CreateServiceRequestUseCase } from "../../application/use-cases/createServiceRequest.useCase";
import { GetCustomerServiceRequestsUseCase } from "../../application/use-cases/getCustomerServiceRequests.useCase";
import { GetProviderServiceRequestsUseCase } from "../../application/use-cases/getProviderServiceRequests.useCase";
import { CancelServiceRequestUseCase } from "../../application/use-cases/cancelServiceRequest.useCase";
import { ReopenServiceRequestUseCase } from "../../application/use-cases/reopenServiceRequest.useCase";
import { UpdateServiceRequestUseCase } from "../../application/use-cases/updateServiceRequest.useCase";
import { GetAdminServiceRequestsUseCase } from "../../application/use-cases/getAdminServiceRequests.useCase";
import { AdminCancelServiceRequestUseCase } from "../../application/use-cases/adminCancelServiceRequest.useCase";
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

export function createCancelServiceRequestUseCase(
    createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
): CancelServiceRequestUseCase {
    return new CancelServiceRequestUseCase(
        serviceRequestRepository,
        createNotificationUseCase,
        createBulkNotificationUseCase,
        serviceRequestProviderRepository
    );
}

export function createReopenServiceRequestUseCase(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
): ReopenServiceRequestUseCase {
    return new ReopenServiceRequestUseCase(
        serviceRequestRepository,
        createBulkNotificationUseCase,
        userRepository,
        addressRepository,
        providerSelectionService,
        serviceRequestProviderRepository,
        quotationRepository
    );
}

export const getCustomerServiceRequestsUseCase = new GetCustomerServiceRequestsUseCase(
    serviceRequestRepository
);

export const getProviderServiceRequestsUseCase = new GetProviderServiceRequestsUseCase(
    serviceRequestProviderRepository,
    providerRepository
);

export function createUpdateServiceRequestUseCase(
    createBulkNotificationUseCase: IUseCase<CreateBulkNotificationRequestDto, NotificationResponseDto[]>
): UpdateServiceRequestUseCase {
    return new UpdateServiceRequestUseCase(
        serviceRequestRepository,
        imageUploadService,
        createBulkNotificationUseCase,
        serviceRequestProviderRepository,
        userRepository,
        addressRepository,
        providerSelectionService
    );
}

export const getAdminServiceRequestsUseCase = new GetAdminServiceRequestsUseCase(
    serviceRequestRepository
);

export const adminCancelServiceRequestUseCase = new AdminCancelServiceRequestUseCase(
    serviceRequestRepository
);
