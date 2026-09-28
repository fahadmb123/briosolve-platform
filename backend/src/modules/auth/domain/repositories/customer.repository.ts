import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js"
import { UserData } from "../../application/dto/authDto.js"
import { Customer } from "../entities/customer.entity.js"





export type RegisterCustomerInput = {
  name:string,
  email : string,
  password:string
}
export interface ICustomerRepository extends BaseRepository<UserData | null>{
  findByEmail(email: string): Promise<Customer | null>
  createCustomer(data: RegisterCustomerInput): Promise<Customer>
  findById(id: string): Promise<UserData | null> 
  updatePassword(id:string,passwordHash: string):Promise<void>
}