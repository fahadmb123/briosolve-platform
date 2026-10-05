import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { UpdateCustomerProfileInputDto } from "../../application/dto/authDto.js";
import { CustomerProfile } from "../entities/customerProfile.entity.js";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    updateProfile(data: UpdateCustomerProfileInputDto): Promise<void>;
    findById(id: string): Promise<CustomerProfile | null> 
}