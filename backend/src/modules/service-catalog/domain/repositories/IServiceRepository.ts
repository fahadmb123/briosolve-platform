import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { AddServiceUseCaseInputDto } from "../../application/dtos/service/request/add-service.dto";
import { UpdateServiceUseCaseDto } from "../../application/dtos/service/request/update-service.dto";
import { GetServicesDto } from "../../application/dtos/category/response/get-service.dto";
import { Service } from "../entities/service.entity";

export interface IServiceRepository extends BaseRepository<Service | null>{
    findByName(name: string): Promise<Service | null>;
    get(input: GetServicesDto): Promise<{services:Service[], total: number}> 
    add(input:AddServiceUseCaseInputDto): Promise<Service | null>
    update(data:UpdateServiceUseCaseDto): Promise<Service | null>
    delete(id: string): Promise<boolean>
}
