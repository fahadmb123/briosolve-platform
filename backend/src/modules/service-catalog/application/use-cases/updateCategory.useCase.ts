import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { Category } from "../../domain/entities/category.entity";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository";
import { UpdateCategoryUseCaseDto } from "../dtos/category/request/update-category.dto";
import { CategoryResponseDto } from "../dtos/category/response/category.dto";






export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryUseCaseDto,CategoryResponseDto>{
    constructor(
        private readonly categoryRepository : ICategoryRepository,
        private readonly imageUploadService: ImageUploadService,
    ){}
    async execute(data: UpdateCategoryUseCaseDto): Promise<CategoryResponseDto> {

        if (data.input.name){
            data.input.name = data.input.name.toLocaleLowerCase()
            const isExist = await this.categoryRepository.findByName(data.input.name)
            if(isExist && String(isExist.id) !== String(data.id)) throw new ApplicationError("NAME_ALREADY_EXIST","name already exist","CONFLICT")
        }
        
        if (data.input.image){
            const isExist = await this.categoryRepository.findById(data.id)

            if (!isExist) throw new ApplicationError("NOT_FUND","Category not exist","NOT_FOUND")

            if (isExist.image) await this.imageUploadService.deleteImageByUrl(isExist.image)
        }
    
        const category = await this.categoryRepository.update(data)

        if (!category) throw new ApplicationError("FAILED","failed","INTERNAL")
            
        return category
    }
}