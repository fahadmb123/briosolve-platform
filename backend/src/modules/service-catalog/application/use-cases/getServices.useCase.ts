import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { GetServicesDto } from "../dtos/category/response/get-service.dto";

export class GetServicesUseCase implements IUseCase<GetServicesDto, { services: Service[], total: number }> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(input: GetServicesDto): Promise<{ services: Service[], total: number }> {
        return await this.serviceRepository.get(input);
    }
}
