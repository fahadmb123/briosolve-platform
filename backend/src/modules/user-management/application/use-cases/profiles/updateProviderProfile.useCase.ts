import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { ImageUploadService } from "../../../../../shared/application/interfaces/services/IImageUpload.service";
import { UpdateProviderProfileInputDto } from "../../dtos/request/provider/update-provider-profile.dto";

export default class UpdateProviderProfileUseCase implements IUseCase<UpdateProviderProfileInputDto, void> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _providerRepository: IProviderRepository,
        private readonly _imageUploadService?: ImageUploadService
    ) {}

    async execute(input: UpdateProviderProfileInputDto): Promise<void> {
        const user = await this._userRepository.findById(input.id);
        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        if (input.data.profile_image !== undefined && this._imageUploadService) {
            const existingProfile = await this._providerRepository.findById(input.id);
            if (existingProfile?.profile_image && existingProfile.profile_image !== input.data.profile_image) {
                await this._imageUploadService.deleteImageByUrl(existingProfile.profile_image);
            }
        }

        await this._providerRepository.updateProfile({ id: input.id, data: input.data });
    }
}
