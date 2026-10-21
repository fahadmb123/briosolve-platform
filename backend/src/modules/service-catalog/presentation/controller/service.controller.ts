import { BaseController } from "../../../../shared/presentation/http/controller/baseController";
import type { NextFunction,Request,Response } from "express";
import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { ImageUploadService } from "../../../../shared/application/interfaces/services/IImageUpload.service";
import { sendSuccess } from "../../../../shared/presentation/http/response/response";
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
            this.getCurrentUser(req)
            if (!req.file) throw new ApplicationError("NOT_FOUND","Service image is required","NOT_FOUND")

            const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer, 'services')

            const response = await this.addServiceUseCase.execute({...req.body, image:imageUrl})

            return sendSuccess(res,"Added",response)
        } catch (error) {
            next(error);
        }
    }

    updateService = async (req:Request, res:Response, next:NextFunction) => {
        try {
            this.getCurrentUser(req)
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

            return sendSuccess(res,"Updated!",response)
        } catch (error) {
            next(error);
        }
    }

    getServices = async (req:Request, res:Response, next:NextFunction) => {
        try {
            this.getCurrentUser(req)
            const limit = Number(req.query.limit) || 10;
            const response = await this.getServicesUseCase.execute({
                page: Number(req.query.page) || 1,
                limit,
                filter: req.query.filter as string | undefined,
                search: req.query.search as string | undefined
            })

            return sendSuccess(res,"", {
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
            this.getCurrentUser(req)
            const id = req.params.id;
            if (!id) throw new ApplicationError("BAD_REQUEST", "Service ID is required", "UNSUPPORTED");

            const response = await this.deleteServiceUseCase.execute(id as string);
            return sendSuccess(res, "Service deleted successfully", response);
        } catch (error) {
            next(error);
        }
    }
}
