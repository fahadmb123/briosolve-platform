import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { IVerificationDocumentRepository } from "../../domain/repositories/IVerificationDocumentRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { UploadVerificationInputDto } from "../dtos/verification/request/upload-verification.dto";
import { UploadVerificationDocumentResponseDto } from "../dtos/verification/response/upload-verification-document.dto";



export class UploadVerificationDocumentUseCase implements IUseCase<UploadVerificationInputDto, UploadVerificationDocumentResponseDto> {
    constructor(
        private readonly _verificationDocumentRepository: IVerificationDocumentRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _imageUploadService: ImageUploadService
    ){}

    async execute(input: UploadVerificationInputDto): Promise<UploadVerificationDocumentResponseDto> {
        const provider = await this._providerRepository.findById(input.userId);
        if (!provider) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }

        if (!input.files || input.files.length === 0) {
            throw new ApplicationError("BAD_REQUEST", "At least one verification document file is required", "VALIDATION");
        }

        const existingDoc = await this._verificationDocumentRepository.findByProviderAndType(
            provider.id,
            input.document_type
        );

        const fileUrls = await Promise.all(
            input.files.map((file) => this._imageUploadService.uploadImage(file.buffer, "verifications"))
        );

        if (existingDoc && existingDoc.files && existingDoc.files.length > 0) {
            await Promise.all(
                existingDoc.files.map((file) => this._imageUploadService.deleteImageByUrl(file.file_url).catch(() => {}))
            );
        }

        return await this._verificationDocumentRepository.createOrUpdate({
            provider_id: provider.id,
            document_type: input.document_type,
            document_name: input.document_name,
            file_urls: fileUrls
        });
    }
}
