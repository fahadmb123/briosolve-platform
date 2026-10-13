import { VerificationController } from "../../presentation/controller/verification.controller.js";
import {
    uploadVerificationDocumentUseCase,
    getProviderVerificationsUseCase,
    updateVerificationDocumentUseCase,
    deleteVerificationDocumentUseCase,
    getAdminVerificationsUseCase,
    updateKycStatusUseCase
} from "./useCases.js";

export const verificationController = new VerificationController(
    uploadVerificationDocumentUseCase,
    getProviderVerificationsUseCase,
    updateVerificationDocumentUseCase,
    deleteVerificationDocumentUseCase,
    getAdminVerificationsUseCase,
    updateKycStatusUseCase
);
