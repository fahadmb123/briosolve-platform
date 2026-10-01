import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { UpdateCustomerProfileInputDto, UserData } from "../../application/dto/authDto.js";
import { Customer } from "../entities/customer.entity.js";
import { RegisterCustomerInput } from "./user.repository.js";




export interface ICustomerRepository {
    createCustomer(data: RegisterCustomerInput): Promise<Customer>
    updateProfile(data: UpdateCustomerProfileInputDto): Promise<void>
}