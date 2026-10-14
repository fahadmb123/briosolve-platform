import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { CustomerProfile } from "../entities/customerProfile.entity.js";
import { User } from "../entities/user.entity.js";
import { RegisterCustomerInput } from "./user.repository.js";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    createCustomer(data: RegisterCustomerInput): Promise<User> 
}