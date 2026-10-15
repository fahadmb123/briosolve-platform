import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { CustomerProfile } from "../entities/customerProfile.entity";
import { User } from "../entities/user.entity";
import { RegisterCustomerInput } from "./user.repository";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    createCustomer(data: RegisterCustomerInput): Promise<User> 
}