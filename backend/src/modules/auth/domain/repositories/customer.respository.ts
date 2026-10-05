import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { UpdateCustomerProfileInputDto, UserData } from "../../application/dto/authDto.js";
import { CustomerProfile } from "../entities/customerProfile.entity.js";
import { User } from "../entities/user.entity.js";
import { RegisterCustomerInput } from "./user.repository.js";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    updateProfile(data: UpdateCustomerProfileInputDto): Promise<void>;
    findById(id: string): Promise<CustomerProfile | null> 
}