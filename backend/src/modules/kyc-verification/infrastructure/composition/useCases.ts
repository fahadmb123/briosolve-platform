import { UploadVerificationDocumentUseCase } from "../../application/use-cases/uploadVerificationDocument.useCase.js";
import { GetProviderVerificationsUseCase } from "../../application/use-cases/getProviderVerifications.useCase.js";
import { UpdateVerificationDocumentUseCase } from "../../application/use-cases/updateVerificationDocument.useCase.js";
import { DeleteVerificationDocumentUseCase } from "../../application/use-cases/deleteVerificationDocument.useCase.js";
import { verificationDocumentRepository } from "./repositories.js";
import { providerRepository } from "../../../user-management/infrastructure/composition/repositories.js";
import { imageService } from "./services.js";

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
