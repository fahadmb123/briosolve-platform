import { BaseRepository } from "../../../../shared/base/repository/baseRepository";
import { UpdateCustomerProfileInputDto } from "../../application/dtos/request/customer/update-customer-profile.dto";
import { CustomerProfile } from "../entities/customerProfile.entity";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    updateProfile(data: UpdateCustomerProfileInputDto): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    createCustomerProfile(userId:string): Promise<void>;
}