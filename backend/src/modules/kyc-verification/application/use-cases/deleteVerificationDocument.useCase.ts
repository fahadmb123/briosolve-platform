import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";

interface DeleteVerificationInputDto {
    id: string;
    userId: string;
}

export class DeleteVerificationDocumentUseCase implements IUseCase<DeleteVerificationInputDto, boolean> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _imageUploadService: ImageUploadService
    ) {}

    async execute(input: DeleteVerificationInputDto): Promise<boolean> {
        const provider = await this._providerRepository.findById(input.userId);
        if (!provider) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const existingDoc = await this._verificationDocumentRepository.findById(input.id);
        if (!existingDoc) {
            throw new ApplicationError("NOT_FOUND", "Verification document not found", "NOT_FOUND");
        }

        if (existingDoc.provider_id !== provider.id) {
            throw new ApplicationError("FORBIDDEN", "Unauthorized access to document", "AUTHORIZATION");
        }

        if (existingDoc.files && existingDoc.files.length > 0) {
            await Promise.all(
                existingDoc.files.map((file) => this._imageUploadService.deleteImageByUrl(file.file_url).catch(() => {}))
            );
        }

        const deleted = await this._verificationDocumentRepository.deleteDocument(input.id);
        if (!deleted) {
            throw new ApplicationError("BAD_REQUEST", "Failed to delete verification document", "INTERNAL");
        }

        return true;
    }
}
