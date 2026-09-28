import { db } from "../../../../shared/infrastructure/persistence/prisma/client.js";
import { User } from "../../domain/entities/user.entity.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";


type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export class UserRepository implements IUserRepository{
    async getCustomers(): Promise<User[]> {
        const users = await db.orm.public.users.where({role:"CUSTOMER"}).all()
        return users 
    }

    async findById(id:string):Promise<User | null>{
        const data = await db.orm.public.users.where({id}).first()
        return data
    }
    async updateStatus(id:string,status:string):Promise<void>{
        await db.orm.public.users.where({id}).update({status:status as UserStatus})
    }
}