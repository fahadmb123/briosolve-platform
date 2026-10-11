import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ProviderService } from "../../domain/entities/providerService.entity.js";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository.js";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository.js";
import { DeleteProviderCategoryInputDto } from "../Dto/providerService.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class DeleteProviderCategoryUseCase implements IUseCase<DeleteProviderCategoryInputDto, ProviderService[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly providerRepository: IProviderRepository
    ){}

    async execute(input: DeleteProviderCategoryInputDto): Promise<ProviderService[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }
        return await this.providerServiceRepository.deleteProviderCategory(profile.id, input.categoryId);
    }
}
