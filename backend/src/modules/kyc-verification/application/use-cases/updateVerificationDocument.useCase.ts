import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { VerificationDocument } from "../../domain/entities/verificationDocument.entity.js";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository.js";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { UpdateVerificationInputDto } from "../Dto/verificationDto.js";

export class UpdateVerificationDocumentUseCase implements IUseCase<UpdateVerificationInputDto, VerificationDocument> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly imageUploadService: ImageUploadService
    ){}

    async execute(input: UpdateVerificationInputDto): Promise<VerificationDocument> {
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

        let newFileUrls: string[] = [];
        if (input.new_files && input.new_files.length > 0) {
            newFileUrls = await Promise.all(
                input.new_files.map((file) => this.imageUploadService.uploadImage(file.buffer, "verifications"))
            );
        }

        const keptFileIds = input.kept_file_ids !== undefined
            ? input.kept_file_ids
            : (existingDoc.files?.map((f) => f.id) || []);

        const currentFilesCount = keptFileIds.length;

        if (currentFilesCount + newFileUrls.length === 0) {
            throw new ApplicationError("BAD_REQUEST", "At least one verification document file is required", "VALIDATION");
        }

        if (existingDoc.files && existingDoc.files.length > 0) {
            const filesToDelete = existingDoc.files.filter((f) => !keptFileIds.includes(f.id));

            if (filesToDelete.length > 0) {
                await Promise.all(
                    filesToDelete.map((f) => this.imageUploadService.deleteImageByUrl(f.file_url).catch(() => {}))
                );
            }
        }

        const updated = await this.verificationDocumentRepository.updateDocument(input.id, {
            document_name: input.document_name,
            kept_file_ids: keptFileIds,
            new_file_urls: newFileUrls
        });

        if (!updated) {
            throw new ApplicationError("NOT_FOUND", "Failed to update verification document", "NOT_FOUND");
        }

        return updated;
    }
}
