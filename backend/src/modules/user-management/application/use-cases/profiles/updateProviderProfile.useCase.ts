import { ApplicationError } from "../../../../../shared/application/errors/applicationError";
import { IUseCase } from "../../../../../shared/application/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IProviderRepository } from "../../../domain/repositories/IProviderRepository";
import { ImageUploadService } from "../../../../../shared/application/interfaces/services/IImageUpload.service";
import { UpdateProviderProfileInputDto } from "../../dtos/request/provider/update-provider-profile.dto";

export default class UpdateProviderProfileUseCase implements IUseCase<UpdateProviderProfileInputDto, void> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly providerRepository: IProviderRepository,
        private readonly imageUploadService?: ImageUploadService
    ) {}

    async execute(input: UpdateProviderProfileInputDto): Promise<void> {
        const user = await this.userRepository.findById(input.id);
        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        if (input.data.profile_image !== undefined && this.imageUploadService) {
            const existingProfile = await this.providerRepository.findById(input.id);
            if (existingProfile?.profile_image && existingProfile.profile_image !== input.data.profile_image) {
                await this.imageUploadService.deleteImageByUrl(existingProfile.profile_image);
            }
        }

        await this.providerRepository.updateProfile({ id: input.id, data: input.data });
    }
}
