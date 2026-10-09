import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { AddServiceUseCaseInputDto } from "../Dto/service.js";
import { Service } from "../../domain/entities/service.entity.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class AddServiceUseCase implements IUseCase<AddServiceUseCaseInputDto, Service> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(input: AddServiceUseCaseInputDto): Promise<Service> {
        const existingService = await this.serviceRepository.findByName(input.name);
        if (existingService) {
            throw new ApplicationError("CONFLICT", "Service with this name already exists", "CONFLICT");
        }
        
        const service = await this.serviceRepository.add(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to add service", "INTERNAL");
        }
        return service;
    }
}
