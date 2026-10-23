import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction,Request,Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { AddCategoryUseCaseInputDto } from "../../application/dtos/category/request/add-category.dto";
import { GetCategoriesDto } from "../../application/dtos/category/response/get-categories.dto";
import { UpdateCategoryUseCaseDto } from "../../application/dtos/category/request/update-category.dto";
import { CategoryResponseDto } from "../../application/dtos/category/response/category.dto";

export class CategoryController extends BaseController{
    constructor(
        private readonly _addCategoryUseCase: IUseCase<AddCategoryUseCaseInputDto, CategoryResponseDto>,
        private readonly _imageUploadService: ImageUploadService,
        private readonly _updateCategoryUseCase: IUseCase<UpdateCategoryUseCaseDto, CategoryResponseDto>,
        private readonly _getCategoriesUseCase: IUseCase<GetCategoriesDto, { categories: CategoryResponseDto[], total: number, totalPages: number }>,
        private readonly _deleteCategoryUseCase: IUseCase<string, boolean>
    ){super()}
    
    addCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            if (!req.file) throw new ApplicationError("NOT_FOUND","Category image is required","NOT_FOUND")

            const imageUrl = await this._imageUploadService.uploadImage(req.file.buffer, 'categories')

            const response = await this._addCategoryUseCase.execute({...req.body,image:imageUrl})

            return this.sendSuccess(res,"Added",response)
        } catch (error) {
            next(error);
        }
    }

    updateCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            let imageUrl: string | undefined = undefined;
            if (req.file) imageUrl = await this._imageUploadService.uploadImage(req.file.buffer, 'categories')
            
            const id = req.params.id
            if (!id) throw new ApplicationError("BAD_REQUEST", "Category ID is required","UNSUPPORTED");

            const response = await this._updateCategoryUseCase.execute({
                id: id as string,
                input: {
                    ...req.body,
                    ...(imageUrl && { image: imageUrl })
                }
            })

            return this.sendSuccess(res,"Updated!",response)
        } catch (error) {
            next(error);
        }
    }

    getCategories = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const response = await this._getCategoriesUseCase.execute({
                page: Number(req.query.page) || 1,
                limit: Number(req.query.limit) || 10,
                filter: req.query.filter as string | undefined,
                search: req.query.search as string | undefined
            })

            return this.sendSuccess(res,"", {
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
            const id = req.params.id;
            if (!id) throw new ApplicationError("BAD_REQUEST", "Category ID is required", "UNSUPPORTED");

            const response = await this._deleteCategoryUseCase.execute(id as string);
            return this.sendSuccess(res, "Category deleted successfully", response);
        } catch (error) {
            next(error);
        }
    }
}