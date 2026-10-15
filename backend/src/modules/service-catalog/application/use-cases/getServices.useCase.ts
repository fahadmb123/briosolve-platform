import { IUseCase } from "../../domain/interfaces/use-cases/IUseCase";
import { GetServicesDto } from "../Dto/service";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";

export class GetServicesUseCase implements IUseCase<GetServicesDto, { services: Service[], total: number }> {
    constructor(
        private serviceRepository: IServiceRepository
    ){}

    async execute(input: GetServicesDto): Promise<{ services: Service[], total: number }> {
        return await this.serviceRepository.get(input);
    }
}
