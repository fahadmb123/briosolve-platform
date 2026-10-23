import { IUseCase } from "../../../../shared/application/interfaces/use-cases/IUseCase";
import { Service } from "../../domain/entities/service.entity";
import { IServiceRepository } from "../../domain/repositories/IServiceRepository";
import { GetServicesDto } from "../dtos/category/response/get-service.dto";
import { ServiceResponseDto } from "../dtos/service/response/service.dto";

export class GetServicesUseCase implements IUseCase<GetServicesDto, { services: ServiceResponseDto[], total: number }> {
    constructor(
        private readonly _serviceRepository: IServiceRepository
    ){}

    async execute(input: GetServicesDto): Promise<{ services: ServiceResponseDto[], total: number }> {
        return await this._serviceRepository.get(input);
    }
}
