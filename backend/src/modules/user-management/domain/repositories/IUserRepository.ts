import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository.js";
import { UpdateUserStatusDto } from "../../application/Dto/userDto.js";
import { User } from "../entities/user.entity.js";



export interface IUserRepository extends BaseRepository<User | null>{
  getCustomers(): Promise<User[]>;
  findById(id:string):Promise<User | null>;
  updateStatus(id:string,status:string):Promise<void>
}