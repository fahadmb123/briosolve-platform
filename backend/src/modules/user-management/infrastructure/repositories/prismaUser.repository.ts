import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { User } from "../../domain/entities/user.entity.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";




export class UserRepository implements IUserRepository{
    async getCustomers(): Promise<User[]> {
        const users = await db.orm.public.users.where({role:"CUSTOMER"}).all()
        return users 
    }
}