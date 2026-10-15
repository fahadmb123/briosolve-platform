import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { VerificationDocument } from "../../domain/entities/verificationDocument.entity";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { UploadVerificationInputDto } from "../Dto/verificationDto";

export class UploadVerificationDocumentUseCase implements IUseCase<UploadVerificationInputDto, VerificationDocument> {
    constructor(
        private readonly verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly imageUploadService: ImageUploadService
    ){}

    async execute(input: UploadVerificationInputDto): Promise<VerificationDocument> {
        const provider = await this.providerRepository.findById(input.userId);
        if (!provider) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        if (!input.files || input.files.length === 0) {
            throw new ApplicationError("BAD_REQUEST", "At least one verification document file is required", "VALIDATION");
        }

        const existingDoc = await this.verificationDocumentRepository.findByProviderAndType(
            provider.id,
            input.document_type
        );

        const fileUrls = await Promise.all(
            input.files.map((file) => this.imageUploadService.uploadImage(file.buffer, "verifications"))
        );

        if (existingDoc && existingDoc.files && existingDoc.files.length > 0) {
            await Promise.all(
                existingDoc.files.map((file) => this.imageUploadService.deleteImageByUrl(file.file_url).catch(() => {}))
            );
        }

        return await this.verificationDocumentRepository.createOrUpdate({
            provider_id: provider.id,
            document_type: input.document_type,
            document_name: input.document_name,
            file_urls: fileUrls
        });
    }
}
