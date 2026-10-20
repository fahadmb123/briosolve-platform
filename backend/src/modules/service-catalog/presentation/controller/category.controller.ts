import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction,Request,Response } from "express";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/domain/interfaces/services/IImageUpload.service";
import { AddCategoryUseCaseInputDto, UpdateCategoryUseCaseDto, GetCategoriesDto } from "../../application/Dto/category";
import { Category } from "../../domain/entities/category.entity";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";



export class CategoryController extends BaseController{
    constructor(
        private readonly addCategoryUseCase : IUseCase<AddCategoryUseCaseInputDto,Category>,
        private readonly imageUploadService: ImageUploadService,
        private readonly updateCategoryUseCase: IUseCase<UpdateCategoryUseCaseDto,Category>,
        private readonly getCategoriesUseCase: IUseCase<GetCategoriesDto,{categories:Category[], total: number, totalPages: number}>,
        private readonly deleteCategoryUseCase: IUseCase<string, boolean>
    ){super()}
    
    addCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            if (!req.file) throw new ApplicationError("NOT_FOUND","Category image is required","NOT_FOUND")

            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'categories')

            const response = await this.addCategoryUseCase.execute({...req.body,image:imageUrl})

            return sendSuccess(res,"Added",response)
        } catch (error) {
            next(error);
        }
    }

    updateCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            let imageUrl: string | undefined = undefined;
            if (req.file) imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'categories')
            
            const id = req.params.id
            if (!id) throw new ApplicationError("BAD_REQUEST", "Category ID is required","UNSUPPORTED");

            const response = await this.updateCategoryUseCase.execute({
                id: id as string,
                input: {
                    ...req.body,
                    ...(imageUrl && { image: imageUrl })
                }
            })

            return sendSuccess(res,"Updated!",response)
        } catch (error) {
            next(error);
        }
    }

    getCategories = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const response = await this.getCategoriesUseCase.execute({
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                filter: req.query.filter as string | undefined,
                search: req.query.search as string | undefined
            })

            return sendSuccess(res,"", {
                categories: response.categories,
                total: response.total,
                totalPages: response.totalPages
            })
        } catch (error) {
            next(error);
        }
    }

    deleteCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            const id = req.params.id;
            if (!id) throw new ApplicationError("BAD_REQUEST", "Category ID is required", "UNSUPPORTED");

            const response = await this.deleteCategoryUseCase.execute(id as string);
            return sendSuccess(res, "Category deleted successfully", response);
        } catch (error) {
            next(error);
        }
    }
}