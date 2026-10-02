import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js"
import { UserData } from "../../application/dto/authDto.js"
import { User } from "../entities/user.entity.js"





export type RegisterCustomerInput = {
  name:string,
  email : string,
  password:string
}



export interface IUserRepository extends BaseRepository<UserData | null>{
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<UserData | null> 
  updatePassword(id:string,passwordHash: string):Promise<void>
  update(id: string, data: { email?: string, phone?: string }): Promise<void>
}