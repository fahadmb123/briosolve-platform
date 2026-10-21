import { BaseRepository } from "../../../../shared/domain/repositories/baseRepository"
import { User } from "../entities/user.entity"

type userPartial = Partial<User>


export interface IUserRepository extends BaseRepository<User | null>{
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null> 
  updatePassword(id:string,passwordHash: string):Promise<void>
  update(id: string, data: userPartial): Promise<void>
}