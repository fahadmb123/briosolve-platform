import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { AddServiceUseCaseInputDto } from "../Dto/service";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { ApplicationError } from "../../../../shared/application/errors/applicationError";

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
