import { VerificationController } from "../../presentation/controller/verification.controller";
import {
    uploadVerificationDocumentUseCase,
    getProviderVerificationsUseCase,
    updateVerificationDocumentUseCase,
    deleteVerificationDocumentUseCase,
    getAdminVerificationsUseCase,
    createUpdateKycStatusUseCase
} from "./useCases";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { CreateNotificationRequestDto } from "../../../notification/application/dtos/request/create-notificastion.dto";
import { NotificationResponseDto } from "../../../notification/application/dtos/response/notification-response.dto";

export function createVerificationController(
    createNotificationUseCase: IUseCase<
        CreateNotificationRequestDto,
        NotificationResponseDto
    >,
): VerificationController {
    const updateKycStatusUseCase = createUpdateKycStatusUseCase(
        createNotificationUseCase,
    );

    return new VerificationController(
        uploadVerificationDocumentUseCase,
        getProviderVerificationsUseCase,
        updateVerificationDocumentUseCase,
        deleteVerificationDocumentUseCase,
        getAdminVerificationsUseCase,
        updateKycStatusUseCase
    );
}
