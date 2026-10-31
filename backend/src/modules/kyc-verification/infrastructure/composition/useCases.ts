import { UploadVerificationDocumentUseCase } from "../../application/use-cases/uploadVerificationDocument.useCase";
import { GetProviderVerificationsUseCase } from "../../application/use-cases/getProviderVerifications.useCase";
import { UpdateVerificationDocumentUseCase } from "../../application/use-cases/updateVerificationDocument.useCase";
import { DeleteVerificationDocumentUseCase } from "../../application/use-cases/deleteVerificationDocument.useCase";
import { GetAdminVerificationsUseCase } from "../../application/use-cases/getAdminVerifications.useCase";
import { UpdateKycStatusUseCase } from "../../application/use-cases/updateKycStatus.useCase";
import { verificationDocumentRepository } from "./repositories";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories";
import { imageService } from "./services";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export const uploadVerificationDocumentUseCase = new UploadVerificationDocumentUseCase(
    verificationDocumentRepository,
    providerRepository,
    imageService
);

export const getProviderVerificationsUseCase = new GetProviderVerificationsUseCase(
    verificationDocumentRepository,
    providerRepository
);

export const updateVerificationDocumentUseCase = new UpdateVerificationDocumentUseCase(
    verificationDocumentRepository,
    providerRepository,
    imageService
);

export const deleteVerificationDocumentUseCase = new DeleteVerificationDocumentUseCase(
    verificationDocumentRepository,
    providerRepository,
    imageService
);

export const getAdminVerificationsUseCase = new GetAdminVerificationsUseCase(
    verificationDocumentRepository
);

export function createUpdateKycStatusUseCase(
    createNotificationUseCase: IUseCase<CreateNotificationRequestDto, NotificationResponseDto>,
): UpdateKycStatusUseCase {
    return new UpdateKycStatusUseCase(
        verificationDocumentRepository,
        createNotificationUseCase,
    );
}
