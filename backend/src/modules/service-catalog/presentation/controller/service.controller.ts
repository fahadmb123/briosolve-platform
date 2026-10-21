import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction,Request,Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { AddServiceUseCaseInputDto } from "../../application/dtos/service/request/add-service.dto";
import { UpdateServiceUseCaseDto } from "../../application/dtos/service/request/update-service.dto";
import { GetServicesDto } from "../../application/dtos/category/response/get-service.dto";
import { ServiceResponseDto } from "../../application/dtos/service/response/service.dto";

export class ServiceController extends BaseController {
    constructor(
        private readonly addServiceUseCase : IUseCase<AddServiceUseCaseInputDto,ServiceResponseDto>,
        private readonly imageUploadService: ImageUploadService,
        private readonly updateServiceUseCase: IUseCase<UpdateServiceUseCaseDto,ServiceResponseDto>,
        private readonly getServicesUseCase: IUseCase<GetServicesDto,{services:ServiceResponseDto[], total: number}>,
        private readonly deleteServiceUseCase: IUseCase<string, boolean>
    ){super()}
    
    addService = async (req:Request, res:Response, next:NextFunction) => {
        try {
            if (!req.file) throw new ApplicationError("NOT_FOUND","Service image is required","NOT_FOUND")

            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'services')

            const response = await this.addServiceUseCase.execute({...req.body, image:imageUrl})

            return this.sendSuccess(res,"Added",response)
        } catch (error) {
            next(error);
        }
    }

    updateService = async (req:Request, res:Response, next:NextFunction) => {
        try {
            let imageUrl: string | undefined = undefined;
            if (req.file) imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'services')
            
            const id = req.params.id
            if (!id) throw new ApplicationError("BAD_REQUEST", "Service ID is required","UNSUPPORTED");

            const response = await this.updateServiceUseCase.execute({
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

    getServices = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const limit = Number(req.query.limit) || 10;
            const response = await this.getServicesUseCase.execute({
                page: Number(req.query.page) || 1,
                limit,
                filter: req.query.filter as string | undefined,
                search: req.query.search as string | undefined
            })

            return this.sendSuccess(res,"", {
                services: response.services,
                total: response.total,
                totalPages: Math.ceil(response.total / limit)
            })
        } catch (error) {
            next(error);
        }
    }

    deleteService = async (req:Request, res:Response, next:NextFunction) => {
        try {
            const id = req.params.id;
            if (!id) throw new ApplicationError("BAD_REQUEST", "Service ID is required", "UNSUPPORTED");

            const response = await this.deleteServiceUseCase.execute(id as string);
            return this.sendSuccess(res, "Service deleted successfully", response);
        } catch (error) {
            next(error);
        }
    }
}
