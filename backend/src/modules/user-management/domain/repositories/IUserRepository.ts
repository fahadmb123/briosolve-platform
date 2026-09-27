import { User } from "../entities/user.entity.js";



export interface IUserRepository {
  getCustomers(): Promise<User[]>
}