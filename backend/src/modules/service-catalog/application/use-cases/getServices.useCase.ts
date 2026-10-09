import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase.js";
import { GetServicesDto } from "../Dto/service.js";
import { Service } from "../../domain/entities/service.entity.js";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository.js";

export class GetServicesUseCase implements IUseCase<GetServicesDto, { services: Service[], total: number }> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(input: GetServicesDto): Promise<{ services: Service[], total: number }> {
        return await this.serviceRepository.get(input);
    }
}
