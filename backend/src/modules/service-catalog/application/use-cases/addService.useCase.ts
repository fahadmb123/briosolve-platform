import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";
import { AddServiceUseCaseInputDto } from "../dtos/service/request/add-service.dto";
import { ServiceResponseDto } from "../dtos/service/response/service.dto";

export class AddServiceUseCase implements IUseCase<AddServiceUseCaseInputDto, ServiceResponseDto> {
    constructor(
        private readonly _serviceRepository: IServiceRepository
    ){}

    async execute(input: AddServiceUseCaseInputDto): Promise<ServiceResponseDto> {
        const existingService = await this._serviceRepository.findByName(input.name);
        if (existingService) {
            throw new ApplicationError("CONFLICT", "Service with this name already exists", "CONFLICT");
        }
        
        const service = await this._serviceRepository.add(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to add service", "INTERNAL");
        }
        return service;
    }
}
