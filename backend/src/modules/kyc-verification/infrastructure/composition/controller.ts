import { VerificationController } from "../../presentation/controller/verification.controller";
import {
    uploadVerificationDocumentUseCase,
    getProviderVerificationsUseCase,
    updateVerificationDocumentUseCase,
    deleteVerificationDocumentUseCase,
    getAdminVerificationsUseCase,
    updateKycStatusUseCase
} from "./useCases";

export const verificationController = new VerificationController(
    uploadVerificationDocumentUseCase,
    getProviderVerificationsUseCase,
    updateVerificationDocumentUseCase,
    deleteVerificationDocumentUseCase,
    getAdminVerificationsUseCase,
    updateKycStatusUseCase
);
