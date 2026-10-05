import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { CustomerProfile } from "../entities/customerProfile.entity.js";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    findById(id: string): Promise<CustomerProfile | null> 
}