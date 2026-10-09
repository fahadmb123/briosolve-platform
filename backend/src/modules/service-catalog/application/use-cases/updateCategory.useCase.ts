import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";
import { Category } from "../../domain/entities/category.entity.js";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository.js";
import { UpdateCategoryUseCaseDto, UpdateCategoryDto } from "../Dto/category.js";




export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryUseCaseDto,Category>{
    constructor(
        private readonly categoryRepository : ICategoryRepository,
        private readonly imageUploadService: ImageUploadService,
    ){}
    async execute(data: UpdateCategoryUseCaseDto): Promise<Category> {

        if (data.input.name){
            const isExist = await this.categoryRepository.findByName(data.input.name)
            if(isExist) throw new ApplicationError("NAME_ALREADY_EXIST","name already exist","CONFLICT")
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