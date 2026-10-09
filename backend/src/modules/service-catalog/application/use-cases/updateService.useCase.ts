import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { UpdateServiceUseCaseDto } from "../Dto/service.js";
import { Service } from "../../domain/entities/service.entity.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class UpdateServiceUseCase implements IUseCase<UpdateServiceUseCaseDto, Service> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(input: UpdateServiceUseCaseDto): Promise<Service> {
        const existingService = await this.serviceRepository.findById(input.id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        
        const service = await this.serviceRepository.update(input);
        if (!service) {
            throw new ApplicationError("INTERNAL_SERVER_ERROR", "Failed to update service", "INTERNAL");
        }
        return service;
    }
}
