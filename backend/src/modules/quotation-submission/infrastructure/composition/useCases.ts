import { IUseCase } from "../../../../shared/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";
import { quotationRepository } from "./repositories";
import { serviceRequestRepository, serviceRequestProviderRepository } from "../../../service-request/infrastructure/composition/repositories";
import { providerRepository, userRepository } from "../../../user-management/infrastructure/composition/repositories";
import { SubmitQuotationUseCase } from "../../application/use-cases/submitQuotation.useCase";
import { GetProviderQuotationsUseCase } from "../../application/use-cases/getProviderQuotations.useCase";
import { UpdateQuotationUseCase } from "../../application/use-cases/updateQuotation.useCase";
import { GetRequestQuotationsUseCase } from "../../application/use-cases/getRequestQuotations.useCase";
import { AcceptQuotationUseCase } from "../../application/use-cases/acceptQuotation.useCase";
import { RejectQuotationUseCase } from "../../application/use-cases/rejectQuotation.useCase";

export function createSubmitQuotationUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): SubmitQuotationUseCase {
    return new SubmitQuotationUseCase(
        quotationRepository,
        serviceRequestRepository,
        providerRepository,
        serviceRequestProviderRepository,
        createNotificationUseCase
    );
}

export function createGetProviderQuotationsUseCase(): GetProviderQuotationsUseCase {
    return new GetProviderQuotationsUseCase(
        quotationRepository,
        providerRepository,
        serviceRequestRepository
    );
}

export function createUpdateQuotationUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): UpdateQuotationUseCase {
    return new UpdateQuotationUseCase(
        quotationRepository,
        providerRepository,
        serviceRequestRepository,
        createNotificationUseCase
    );
}

export function createGetRequestQuotationsUseCase(): GetRequestQuotationsUseCase {
    return new GetRequestQuotationsUseCase(
        quotationRepository,
        serviceRequestRepository,
        providerRepository,
        userRepository
    );
}

export function createAcceptQuotationUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): AcceptQuotationUseCase {
    return new AcceptQuotationUseCase(
        quotationRepository,
        serviceRequestRepository,
        providerRepository,
        createNotificationUseCase
    );
}

export function createRejectQuotationUseCase(
    createNotificationUseCase?: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>
): RejectQuotationUseCase {
    return new RejectQuotationUseCase(
        quotationRepository,
        serviceRequestRepository,
        providerRepository,
        createNotificationUseCase
    );
}
