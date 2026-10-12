import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { IProviderRepository } from "../../domain/repositories/IProviderRepository.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";
import { UpdateProviderProfileInputDto } from "../Dto/providerDto.js";

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
