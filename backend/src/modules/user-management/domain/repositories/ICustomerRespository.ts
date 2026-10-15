import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository";
import { UpdateCustomerProfileInputDto } from "../../application/Dto/userDto";
import { CustomerProfile } from "../entities/customerProfile.entity";




export interface ICustomerRepository extends BaseRepository<CustomerProfile | null>{
    updateProfile(data: UpdateCustomerProfileInputDto): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}