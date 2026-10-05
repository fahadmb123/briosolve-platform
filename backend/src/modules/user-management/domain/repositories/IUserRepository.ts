import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { getCustomersDto } from "../../application/Dto/getCustomersDto.js";
import { UpdateUserStatusDto } from "../../application/Dto/userDto.js";
import { User } from "../entities/user.entity.js";



export interface IUserRepository extends BaseRepository<User | null>{
  getCustomers(input:getCustomersDto): Promise<{users:User[],total:number}>;
  findById(id:string):Promise<User | null>;
  updateStatus(id:string,status:string):Promise<void>
  findByEmail(email: string): Promise<User | null>
}