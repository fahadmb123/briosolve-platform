import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository.js";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

interface DeleteVerificationInputDto {
    id: string;
    userId: string;
}

export class DeleteVerificationDocumentUseCase implements IUseCase<DeleteVerificationInputDto, boolean> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly imageUploadService: ImageUploadService
    ) {}

    async execute(input: DeleteVerificationInputDto): Promise<boolean> {
        const provider = await this.providerRepository.findById(input.userId);
        if (!provider) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        const existingDoc = await this.verificationDocumentRepository.findById(input.id);
        if (!existingDoc) {
            throw new ApplicationError("NOT_FOUND", "Verification document not found", "NOT_FOUND");
        }

        if (existingDoc.provider_id !== provider.id) {
            throw new ApplicationError("FORBIDDEN", "Unauthorized access to document", "AUTHORIZATION");
        }

        if (existingDoc.files && existingDoc.files.length > 0) {
            await Promise.all(
                existingDoc.files.map((file) => this.imageUploadService.deleteImageByUrl(file.file_url).catch(() => {}))
            );
        }

        const deleted = await this.verificationDocumentRepository.deleteDocument(input.id);
        if (!deleted) {
            throw new ApplicationError("BAD_REQUEST", "Failed to delete verification document", "INTERNAL");
        }

        return true;
    }
}
