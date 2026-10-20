import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { AddServiceUseCaseInputDto, UpdateServiceUseCaseDto, GetServicesDto } from "../../application/dtos/service";
import { Service } from "../entities/service.entity";

export interface IServiceRepository extends BaseRepository<Service | null>{
    findByName(name: string): Promise<Service | null>;
    get(input: GetServicesDto): Promise<{services:Service[], total: number}> 
    add(input:AddServiceUseCaseInputDto): Promise<Service | null>
    update(data:UpdateServiceUseCaseDto): Promise<Service | null>
    delete(id: string): Promise<boolean>
}
