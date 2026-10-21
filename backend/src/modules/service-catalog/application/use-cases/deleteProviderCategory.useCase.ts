import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ProviderService } from "../../domain/entities/providerService.entity";
import { IProviderServiceRepository } from "../../domain/repositories/IProviderServiceRepository";
import { IProviderRepository } from "../../../user-management/domain/repositories/IProviderRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { DeleteProviderCategoryInputDto } from "../dtos/provider/request/delete-provider-category.dto";
import { ProviderServiceResponseDto } from "../dtos/provider/response/provider-service.dto";

export class DeleteProviderCategoryUseCase implements IUseCase<DeleteProviderCategoryInputDto, ProviderServiceResponseDto[]> {
    constructor(
        private readonly providerServiceRepository: IProviderServiceRepository,
        private readonly providerRepository: IProviderRepository
    ){}

    async execute(input: DeleteProviderCategoryInputDto): Promise<ProviderServiceResponseDto[]> {
        const profile = await this.providerRepository.findById(input.userId);
        if (!profile) {
            throw new ApplicationError("NOT_FOUND", "Provider profile not found", "NOT_FOUND");
        }
        return await this.providerServiceRepository.deleteProviderCategory(profile.id, input.categoryId);
    }
}
