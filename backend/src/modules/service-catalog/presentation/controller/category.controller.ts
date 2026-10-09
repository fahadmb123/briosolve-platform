import { BaseController } from "../../../../shared/presentation/http/controller/baseController.js";
import type { NextFunction,Request,Response } from "express";
import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";
import { ImageUploadService } from "../../../../shared/domain/interfaces/IImageUpload.service.js";
import { AddCategoryUseCaseInputDto } from "../../application/Dto/category.js";
import { Category } from "../../domain/entities/category.entity.js";
import { sendSuccess } from "../../../../shared/presentation/http/response/response.js";



export class CategoryController extends BaseController{
    constructor(
        private readonly addCategoryUseCase : IUseCase<AddCategoryUseCaseInputDto,Category>,
        private readonly imageUploadService: ImageUploadService
    ){super()}
    
    addCategory = async (req:Request, res:Response, next:NextFunction) => {
        try {
            if (!req.file) throw new ApplicationError("NOT_FOUND","Category image is required","NOT_FOUND")

            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'categories')

            const response = await this.addCategoryUseCase.execute({...req.body,image:imageUrl})

            return sendSuccess(res,"Added",response)
        } catch (error) {
            next(error);
        }
    }
}