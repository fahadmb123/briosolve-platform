import { ApplicationError } from "../../../../../shared/errors/applicationError";
import { IUseCase } from "../../../../../shared/interfaces/use-cases/IUseCase";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICustomerRepository } from "../../../domain/repositories/ICustomerRespository";
import { ImageUploadService } from "../../../../../shared/interfaces/services/IImageUpload.service";
import { UpdateCustomerProfileInputDto } from "../../dtos/request/customer/update-customer-profile.dto";

export default class UpdateCustomerProfileUseCase implements IUseCase<UpdateCustomerProfileInputDto, void> {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _customerRepository: ICustomerRepository,
        private readonly _imageUploadService?: ImageUploadService
    ) {}

    async execute(input: UpdateCustomerProfileInputDto): Promise<void> {
        const user = await this._userRepository.findById(input.id);
        if (!user) throw new ApplicationError("USER_NOT_FOUND", "User not found", "NOT_FOUND");

        if (input.data.profile_image !== undefined && this._imageUploadService) {
            const existingProfile = await this._customerRepository.findById(input.id);
            if (existingProfile?.profile_image && existingProfile.profile_image !== input.data.profile_image) {
                await this._imageUploadService.deleteImageByUrl(existingProfile.profile_image);
            }
        }

        await this._customerRepository.updateProfile({ id: input.id, data: input.data });
        return;
    }
}