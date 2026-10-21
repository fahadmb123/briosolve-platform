import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { RegisterCustomerInput } from "../../application/dtos/request/register-customer.dto";
import { CustomerProfile } from "../entities/customerProfile.entity";
import { User } from "../entities/user.entity";





export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    createCustomer(data: RegisterCustomerInput): Promise<User> 
}