import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";
import { ApplicationError } from "../../../../shared/application/errors/applicationError.js";

export class DeleteServiceUseCase implements IUseCase<string, boolean> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(id: string): Promise<boolean> {
        const existingService = await this.serviceRepository.findById(id);
        if (!existingService) {
            throw new ApplicationError("NOT_FOUND", "Service not found", "NOT_FOUND");
        }
        return await this.serviceRepository.delete(id);
    }
}
